# 🚀 RIPER-5 OpenCode Project Template

Template for OpenCode projects with the complete **RIPER-5 workflow** configured.

## ✨ Features

| Component | Description |
|-----------|-------------|
| **7 RIPER-5 Agents** | research, spec, innovate, plan, validate, execute, update-process |
| **9 Functional Hooks** | Session init, scout blocking, privacy protection, state management |
| **Access Control** | Command whitelist via `.opencode/permissions.json` |
| **RIPER-5 Structure** | `process/general-plans/` and `process/features/` ready to use |

## 📦 Quick Start

### Option 1: Clone from GitHub

```bash
git clone <YOUR_GITHUB_REPO> new-project/
cd new-project
opencode
```

### Option 2: Use as GitHub Template Repository

1. Go to your repository on GitHub
2. Click **Use this template** → **Create a new repository**
3. Create new repo with RIPER-5 configuration pre-configured

## 📚 Key Files

| File | Purpose |
|------|---------|
| `AGENTS.md` | RIPER-5 workflow definition |
| `.opencode/hooks/hooks.yaml` | Hooks configuration |
| `.opencode/permissions.json` | Access control whitelist |
| `process/README.md` | Workflow guide |

## 🎯 Installation Script

```bash
./install-riper5.sh .
```

This script will:
- Copy all hooks and agents
- Configure access control
- Create RIPER-5 folder structure

---

**Version**: 1.0.0  
**License**: MIT
