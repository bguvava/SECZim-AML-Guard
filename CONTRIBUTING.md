# Contributing to AMLGuard

Thank you for your interest in contributing to AMLGuard! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and professional in all interactions
- Provide constructive feedback
- Help team members learn and grow
- Report issues privately if they involve sensitive compliance matters

## Getting Started

1. **Fork the Repository** (if working externally)
2. **Clone the Repository** to your local machine
3. **Create a feature branch** from `main`
4. **Follow the development setup** in [DEVELOPMENT.md](./DEVELOPMENT.md)

## Development Workflow

### Branch Naming Convention

```
feature/description        # New features
bugfix/description         # Bug fixes
docs/description           # Documentation updates
refactor/description       # Code refactoring
test/description           # Test additions
chore/description          # Maintenance tasks
```

**Example:**
- `feature/entity-registry-modal`
- `bugfix/authentication-token-refresh`
- `docs/api-integration-guide`

### Commit Message Format

Follow the Conventional Commits specification:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that don't affect code meaning (formatting, semicolons, etc.)
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `perf:` Code change that improves performance
- `test:` Adding or updating tests
- `chore:` Changes to build process, dependencies, or tooling

**Example:**
```
feat(auth): add two-factor authentication support

Implements 2FA verification using TOTP algorithm.
Adds UI components for code entry and backup codes.

Fixes #123
```

### Pull Request Process

1. **Create a feature branch** from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following coding standards

3. **Write/Update tests** for your changes
   ```bash
   pnpm test
   ```

4. **Format and lint your code**
   ```bash
   pnpm format
   pnpm lint
   ```

5. **Commit with meaningful messages** using the format above

6. **Push your branch** to GitHub
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request (PR)**
   - Link related issues using `Fixes #issue-number`
   - Provide a clear description of changes
   - Ensure CI/CD checks pass
   - Request review from team members

8. **Address Review Comments**
   - Make requested changes
   - Push additional commits (no force push during review)
   - Re-request review once resolved

9. **Merge** after approval (maintainer action)

## Code Style Guide

### TypeScript

- Use **strict mode** (`strict: true` in tsconfig.json)
- Use **const** by default, **let** if reassignment needed
- Avoid **any** type; use proper typing
- Use **interfaces** for object shapes
- Add **JSDoc comments** for complex functions

```typescript
/**
 * Validates user credentials against the authentication system
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise resolving to authentication token or null
 * @throws AuthenticationError if credentials are invalid
 */
async function validateCredentials(
  email: string,
  password: string
): Promise<string | null> {
  // Implementation
}
```

### Vue Components

- Use **Composition API** (not Options API)
- Keep components **focused and single-responsibility**
- Name components with **PascalCase**
- Use **scoped styles** (`<style scoped>`)
- Document **props and emits** with TypeScript

```vue
<script setup lang="ts">
interface Props {
  title: string;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  click: [];
  update: [value: string];
}>();
</script>
```

### CSS/Tailwind

- Use **Tailwind CSS utilities** instead of custom CSS when possible
- Follow **mobile-first approach**
- Use **meaningful class names**
- Avoid **inline styles**
- Keep specificity low

## Testing

- **Minimum 80% code coverage**
- Write tests for:
  - All utility functions
  - Complex component logic
  - Store (Pinia) state management
  - API integrations (mocked)

```bash
# Run tests
pnpm test

# Run with UI
pnpm test:ui

# Check coverage
pnpm test -- --coverage
```

## Documentation

- Update **README.md** if adding new features
- Add **JSDoc comments** to functions and components
- Update relevant docs in `/docs` folder
- Keep documentation **in sync with code**

## Issues

### Reporting Bugs

Use the bug report template when creating an issue:

```markdown
**Description:** Clear description of the bug
**Steps to Reproduce:** 
1. Step 1
2. Step 2
**Expected Behavior:** What should happen
**Actual Behavior:** What actually happens
**Screenshots:** If applicable
**Environment:** OS, Browser, Node version, etc.
```

### Requesting Features

Use the feature request template:

```markdown
**Description:** Clear description of the desired feature
**Problem Solved:** What problem does this solve?
**Proposed Solution:** How should it work?
**Alternative Solutions:** Other approaches considered
**Additional Context:** Any other relevant information
```

## Review Process

### For Reviewers

- Check **code quality and style**
- Verify **tests are included and passing**
- Ensure **documentation is updated**
- Look for **potential performance issues**
- Provide **constructive feedback**

### For Authors

- Respond to **all review comments**
- Make **small, focused commits** in response
- **Don't force push** once in review
- **Re-request review** when done addressing feedback

## Performance & Security

### Performance

- Monitor **bundle size**
- Profile **component rendering**
- Optimize **API calls**
- Use **code splitting** for large features

### Security

- **Never commit secrets** (API keys, tokens, passwords)
- Use **environment variables** for configuration
- Follow **OWASP security guidelines**
- Validate **all user inputs**
- Report **security issues privately** (don't use public issues)

## Deployment

- Changes to `main` branch are automatically deployed
- Ensure **all tests pass** before merging
- Coordinate **database migrations** with team
- Update **version numbers** appropriately

## Questions?

- Check existing documentation in `/docs`
- Search **closed issues** for similar questions
- Ask in **team discussions** or comments
- Contact **project maintainers**

---

**Thank you for contributing to AMLGuard! 🙏**
