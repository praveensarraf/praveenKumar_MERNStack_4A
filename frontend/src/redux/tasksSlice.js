import { createSlice } from "@reduxjs/toolkit";

const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
  },
  reducers: {
    setTasks: (state, action) => {
      state.tasks = action.payload;
    },
  },
});

export const { setTasks } = tasksSlice.actions;
export default tasksSlice.reducer;
