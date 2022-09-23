import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import thunk from 'redux-thunk'

export const rootSlice = createSlice({
  name: 'root',
  initialState: {
    hello: true,
  },
  reducers: {
    setHello: (state, action: PayloadAction<boolean>) => {
      state.hello = action.payload
    },
  },
})

const rootReducer = {
  root: rootSlice.reducer,
}

const getReduxStore = (defaultState: { [x: string]: any }) => {
  return configureStore({
    reducer: rootReducer,
    middleware: [thunk],
    devTools: false,
    preloadedState: defaultState,
  })
}

const initialState = getReduxStore({}).getState

export type RootState = ReturnType<typeof initialState>

export default getReduxStore
