
# 毕生优养商城 - GitHub 上传指南

## 本地仓库状态 ✅

本地 Git 仓库已成功初始化并完成第一次提交：
- 已提交文件：admin.html, index.html, 修改说明.md
- 当前分支：master

## 步骤一：创建 GitHub 仓库

1. 访问 GitHub 新建仓库页面：https://github.com/new
2. 填写仓库信息：
   - **Repository name（仓库名称）**：`毕生优养商城`（或英文：`BiShengYouYangMall`）
   - **Description（描述）**：毕生优养电商网站
   - **Public/Private**：选择您想要的权限
   - **⚠️ 重要**：**不要**勾选 "Initialize this repository with a README"、"Add .gitignore" 或 "Choose a license"
3. 点击 **"Create repository"** 按钮

## 步骤二：推送代码到 GitHub

创建仓库后，GitHub 会显示一些命令。请按以下步骤操作：

### 方法 A：使用 HTTPS 推送（推荐）

在 PowerShell 或 Git Bash 中运行：

```bash
cd "C:\Users\DELL\Desktop\毕生优养商城"

# 添加远程仓库（将 YOUR_USERNAME 替换为您的 GitHub 用户名）
git remote add origin https://github.com/YOUR_USERNAME/毕生优养商城.git

# 将分支重命名为 main（如果需要）
git branch -M main

# 推送代码
git push -u origin main
```

### 方法 B：使用 SSH 推送

如果您已经配置了 SSH 密钥：

```bash
cd "C:\Users\DELL\Desktop\毕生优养商城"

# 添加远程仓库（将 YOUR_USERNAME 替换为您的 GitHub 用户名）
git remote add origin git@github.com:YOUR_USERNAME/毕生优养商城.git

# 将分支重命名为 main（如果需要）
git branch -M main

# 推送代码
git push -u origin main
```

## 步骤三：验证上传成功

推送成功后，刷新您的 GitHub 仓库页面，您应该能看到：
- admin.html
- index.html
- 修改说明.md
- README.md（如果您创建了）

## 常见问题解决

### 问题1：提示认证失败
**解决方案**：
- 如果使用 HTTPS，GitHub 现在要求使用 Personal Access Token (PAT)
- 如何创建 PAT：https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

### 问题2：提示 remote origin already exists
**解决方案**：
```bash
git remote remove origin
# 然后重新执行 git remote add origin ... 命令
```

### 问题3：提示 error: src refspec main does not match any
**解决方案**：
您可能还没有创建任何提交。检查一下：
```bash
git status
```
如果没有提交，运行：
```bash
git add .
git commit -m "Initial commit"
```

## 获取您的仓库地址

成功推送后，您的仓库地址将是：
- HTTPS：`https://github.com/您的用户名/毕生优养商城`
- SSH：`git@github.com:您的用户名/毕生优养商城.git`

## 后续更新代码

将来您修改代码后，只需要运行：

```bash
git add .
git commit -m "您的提交说明"
git push
```

祝您使用愉快！

