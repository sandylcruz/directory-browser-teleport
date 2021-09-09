import type UserModel from './backend/models/user';

export type User = ReturnType<UserModel['toJSON']>;
