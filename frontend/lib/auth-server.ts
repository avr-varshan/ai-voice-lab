import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

const USERS_FILE = path.join(process.cwd(), 'users.json');

interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
}

// Initialize users file if it doesn't exist
function initUsersFile() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
}

function getUsers(): User[] {
  initUsersFile();
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  return JSON.parse(data);
}

function saveUsers(users: User[]) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function createUser(email: string, password: string, name?: string) {
  const users = getUsers();
  
  // Check if user already exists
  if (users.find(u => u.email === email)) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser: User = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
    name
  };

  users.push(newUser);
  saveUsers(users);

  return { id: newUser.id, email: newUser.email, name: newUser.name };
}

export async function verifyUserCredentials(credentials: any) {
  if (!credentials?.email || !credentials?.password) {
    return null;
  }

  const users = getUsers();
  const user = users.find(u => u.email === credentials.email);

  if (!user) {
    return null;
  }

  const isValid = await bcrypt.compare(credentials.password, user.password);
  
  if (isValid) {
    return { id: user.id, email: user.email, name: user.name };
  }

  return null;
}