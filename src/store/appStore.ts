// Redux Toolkit 配置文件
import { configureStore } from '@reduxjs/toolkit';
import appSlice from './slices/appSlice';
import blueprintSlice from './slices/blueprintSlice';
import functionWindowSlice from './slices/functionWindowSlice';

// 配置 Redux Store
export const appStore = configureStore({
  reducer: {
    app: appSlice,
    blueprint: blueprintSlice,
    functionWindow: functionWindowSlice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ 
      serializableCheck: false 
    }),
  devTools: process.env.NODE_ENV !== 'production' // 只在非生产环境启用 Redux DevTools
});

// 导出 Store 的 RootState 和 AppDispatch 类型
export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
