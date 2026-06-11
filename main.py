import os
import datetime
from github import Github
from slack_sdk import WebClient
from slack_sdk.errors import SlackApiError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
SLACK_BOT_TOKEN = os.getenv("SLACK_BOT_TOKEN")
SLACK_CHANNEL_ID = os.getenv("SLACK_CHANNEL_ID")
GITHUB_REPOS = os.getenv("MONITOR_REPOS", "")

def get_daily_summary():
    g = Github(GITHUB_TOKEN)
    now = datetime.datetime.now(datetime.timezone.utc)
    since = now - datetime.timedelta(days=1)
    
    summary_data = []
    
    # Parse repo list
    repo_names = [r.strip() for r in GITHUB_REPOS.split(",") if r.strip()]
    
    if not repo_names:
        # If no repos specified, fetch all repos of the authenticated user
        repos = g.get_user().get_repos(sort="updated", direction="desc")
    else:
        repos = [g.get_repo(name) for name in repo_names]

    for repo in repos:
        # Check if repo was updated in last 24h to avoid unnecessary API calls
        if repo.updated_at < since:
            if not repo_names: # If scanning all, we can break early if sorted by updated
                break
            continue
            
        repo_summary = {
            "name": repo.full_name,
            "commits": [],
            "prs": [],
            "issues": []
        }
        
        # Fetch Commits
        try:
            commits = repo.get_commits(since=since)
            for commit in commits:
                repo_summary["commits"].append({
                    "msg": commit.commit.message.split('\n')[0],
                    "author": commit.commit.author.name,
                    "url": commit.html_url
                })
        except Exception:
            pass
            
        # Fetch PRs (opened or updated)
        pulls = repo.get_pulls(state='all', sort='updated', direction='desc')
        for pr in pulls:
            if pr.updated_at < since:
                break
            repo_summary["prs"].append({
                "title": pr.title,
                "state": pr.state,
                "url": pr.html_url
            })
            
        # Fetch Issues (opened or updated)
        issues = repo.get_issues(state='all', since=since)
        for issue in issues:
            if issue.pull_request: # Skip PRs which are also returned as issues
                continue
            repo_summary["issues"].append({
                "title": issue.title,
                "state": issue.state,
                "url": issue.html_url
            })
            
        if repo_summary["commits"] or repo_summary["prs"] or repo_summary["issues"]:
            summary_data.append(repo_summary)
            
    return summary_data

def format_slack_message(summary_data):
    blocks = [
        {
            "type": "header",
            "text": {
                "type": "plain_text",
                "text": "📅 오늘의 깃허브 작업 요약",
                "emoji": True
            }
        },
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": f"*리포트 생성 시간:* {datetime.datetime.now().strftime('%Y-%m-%d %H:%M')}"
            }
        },
        {"type": "divider"}
    ]
    
    if not summary_data:
        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "지난 24시간 동안 새로운 활동이 없습니다. 😴"
            }
        })
        return blocks

    for repo in summary_data:
        text = f"*<{f'https://github.com/{repo['name']}'}|{repo['name']}>*\n"
        
        if repo["commits"]:
            text += "• *Commits*\n"
            for c in repo["commits"][:5]: # Limit to 5 per repo
                text += f"  - {c['msg']} ({c['author']})\n"
            if len(repo["commits"]) > 5:
                text += f"  - ...외 {len(repo['commits'])-5}개의 커밋\n"
                
        if repo["prs"]:
            text += "• *PRs*\n"
            for pr in repo["prs"]:
                state_emoji = "✅" if pr["state"] == "closed" else "🏗️"
                text += f"  - {state_emoji} {pr['title']}\n"
                
        if repo["issues"]:
            text += "• *Issues*\n"
            for issue in repo["issues"]:
                state_emoji = "🟣" if issue["state"] == "closed" else "🔴"
                text += f"  - {state_emoji} {issue['title']}\n"
                
        blocks.append({
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": text
            }
        })
        blocks.append({"type": "divider"})
        
    return blocks

def send_to_slack(blocks):
    client = WebClient(token=SLACK_BOT_TOKEN)
    try:
        response = client.chat_postMessage(
            channel=SLACK_CHANNEL_ID,
            blocks=blocks,
            text="오늘의 깃허브 작업 요약이 도착했습니다!"
        )
        print(f"Message sent: {response['ts']}")
    except SlackApiError as e:
        print(f"Error sending message: {e}")

if __name__ == "__main__":
    print("Fetching activity...")
    data = get_daily_summary()
    print("Formatting message...")
    slack_blocks = format_slack_message(data)
    print("Sending to Slack...")
    send_to_slack(slack_blocks)
