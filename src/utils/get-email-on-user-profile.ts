import { octokit } from '../octokit';

export async function getEmailOnUserProfile(login: string) {
  const {
    data: { email }
  } = await octokit.users.getByUsername({ username: login });

  return email;
}
