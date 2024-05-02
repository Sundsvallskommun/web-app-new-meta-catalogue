import { PatchUserSettingsDto, User } from '@data-contracts/backend/data-contracts';
import { ServiceResponse } from '@interfaces/service';
import { __DEV__ } from '@sk-web-gui/react';
import { devtools } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import { ApiResponse, apiService } from '../api-service';
import { emptyUser } from './defaults';

const handleSetUserResponse: (res: ApiResponse<User>) => User = (res) => ({
  name: res.data.name,
  username: res.data.username,
  role: res.data.role,
  permissions: res.data.permissions,
  readCommentsClearedDate: res.data.readCommentsClearedDate,
});

const getMe: () => Promise<User> = () => {
  return apiService
    .get<ApiResponse<User>>('me')
    .then((res) => handleSetUserResponse(res.data))
    .catch((err) => {
      return Promise.reject(err.response?.data?.message);
    });
};

const patchMe: (userPatch: PatchUserSettingsDto) => Promise<ServiceResponse<User>> = (userPatch) => {
  return apiService
    .patch<ApiResponse<User>>('me', userPatch)
    .then((res) => ({
      data: handleSetUserResponse(res.data),
    }))
    .catch((err) => {
      return Promise.reject(err.response?.data?.message);
    });
};

interface State {
  user: User;
}
interface Actions {
  setUser: (user: User) => void;
  patchMe: (userPatch: PatchUserSettingsDto) => Promise<ServiceResponse<User>>;
  getMe: () => Promise<User>;
  reset: () => void;
}

const initialState: State = {
  user: emptyUser,
};

export const useUserStore = createWithEqualityFn<State & Actions>()(
  devtools(
    (set) => ({
      ...initialState,
      setUser: (user) => set(() => ({ user })),
      getMe: getMe,
      patchMe: async (userPatch) => {
        const res = await patchMe(userPatch);
        const data = (!res.error && res.data) || initialState.user;
        await set(() => ({ user: data }));
        return { data, error: res.error };
      },
      reset: () => {
        set(initialState);
      },
    }),
    { name: 'user-storage', enabled: __DEV__ }
  )
);
