const initialState = {
    data: [],
    loading: false,
    page: 1,
  };
  
  const photoReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_PHOTOS_REQUEST':
        return {
          ...state,
          loading: true,
        };
      case 'FETCH_PHOTOS_SUCCESS':
        return {
          ...state,
          data: [...state.data, ...action.payload],
          loading: false,
          page: state.page + 1,
        };
      case 'FETCH_PHOTOS_FAILURE':
        return {
          ...state,
          loading: false,
        };
      default:
        return state;
    }
  };
  
  export default photoReducer;
  