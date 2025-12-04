// 自定义 Redux hooks
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './appStore';

// 自定义 useDispatch hook，类型为 AppDispatch
export const useAppDispatch: () => AppDispatch = useDispatch;

// 自定义 useSelector hook，类型为 RootState
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
