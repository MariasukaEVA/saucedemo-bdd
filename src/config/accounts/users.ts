import { TestUser, UserRole, Environment } from '../../types';

// SauceDemo credentials are public test credentials — safe to store here
const USERS: TestUser[] = [
  { username: 'standard_user',       password: 'secret_sauce', role: 'standard',    env: 'uat' },
  { username: 'locked_out_user',     password: 'secret_sauce', role: 'locked',      env: 'uat' },
  { username: 'problem_user',        password: 'secret_sauce', role: 'problem',     env: 'uat' },
  { username: 'performance_glitch_user', password: 'secret_sauce', role: 'performance', env: 'uat' },
  { username: 'error_user',          password: 'secret_sauce', role: 'error',       env: 'uat' },
  { username: 'visual_user',         password: 'secret_sauce', role: 'visual',      env: 'uat' },
  // dev/sit/prod would have different credentials loaded from env vars
  { username: process.env.DEV_STANDARD_USER || 'standard_user', password: process.env.DEV_PASSWORD || 'secret_sauce', role: 'standard', env: 'dev' },
  { username: process.env.SIT_STANDARD_USER || 'standard_user', password: process.env.SIT_PASSWORD || 'secret_sauce', role: 'standard', env: 'sit' },
];

export function getUser(role: UserRole, env: Environment = 'uat'): TestUser {
  const user = USERS.find(u => u.role === role && u.env === env);
  if (!user) {
    throw new Error(`No test user found for role="${role}" env="${env}"`);
  }
  return user;
}

export function getAllUsers(env: Environment = 'uat'): TestUser[] {
  return USERS.filter(u => u.env === env);
}
