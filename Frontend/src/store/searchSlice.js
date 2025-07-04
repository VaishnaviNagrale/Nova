import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  videos: [],
  isSearched: false,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchResults(state, action) {
      state.videos = action.payload;
      state.isSearched = true;
    },
    resetSearch(state) {
      state.videos = [];
      state.isSearched = false;
    },
  },
});

export const { setSearchResults, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;
