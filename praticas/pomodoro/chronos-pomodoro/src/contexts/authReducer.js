export function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
      };

    case 'RESTORE_SESSION':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
      };

    case 'LOGOUT':
      return {
        isAuthenticated: false,
        user: null,
        token: null,
        isLoading: false,
      };

    case 'FINISH_LOADING':
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
}
