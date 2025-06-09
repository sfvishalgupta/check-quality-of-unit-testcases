# Check Quality of Unit Testcases

![GitHub Actions CI/CD](https://github.com/your-org/check-quality-of-unit-testcases/actions/workflows/automation-test-quality-of-ut.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

AI-powered GitHub Action for analyzing unit test quality and coverage metrics.

## Features
- Automated test quality assessment using AI analysis
- Jira integration for issue tracking (via `utils/jira.ts`)
- Customizable quality thresholds
- GitHub Actions CI/CD integration
- TypeScript support with pre-commit formatting

## Prerequisites
- Node.js 18+
- npm 9+
- GitHub Actions environment

## Installation
```bash
git clone https://github.com/your-org/check-quality-of-unit-testcases.git
cd check-quality-of-unit-testcases
npm install
```

## Usage
```bash
# Build project
npm run build

# Format code
npm run format

# Check formatting
npm run format-check
```

## Configuration
1. Create `.env` file from template:
```bash
cp environment.ts .env
```
2. Configure Jira credentials in `utils/jira.ts`
3. Set quality thresholds in `types.ts`

## GitHub Actions Integration
Add to your workflow (`.github/workflows/quality-check.yml`):
```yaml
name: Test Quality Check
on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: ./check-quality-of-unit-testcases
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
```

## Contributing
1. Fork the repository
2. Create feature branch (`git checkout -b feature/improvement`)
3. Commit changes (`git commit -am 'Add new feature'`)
4. Push to branch (`git push origin feature/improvement`)
5. Open Pull Request

## License
MIT © 2025 Vishal Gupta

## Support
Contact: vishal.gupta@example.com
