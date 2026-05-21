
import type { RootState, AppDispatch } from '../app/store'
import { TypedUseSelectorHook, useSelector,useDispatch } from "react-redux";
// بتقول لـ TypeScript:

//"الـ useDispatch ده شيل معاك الـ AppDispatch دايماً"
//// لازم تكتب الـ type كل مرة
//const dispatch = useDispatch<AppDispatch>()
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;