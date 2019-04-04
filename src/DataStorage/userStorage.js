const UserStorage = {
  data: {
    userId: null,
    userName: null,
    email: null,
    givenName: null,
    familyName: null
  },
  methods: {
    setUserData(user, userId) {
      UserStorage.data.userId = userId;
      UserStorage.data.userName = user.userName;
      UserStorage.data.email = user.email;
      UserStorage.data.givenName = user.givenName;
      UserStorage.data.familyName = user.familyName;
    },
    isLoggedIn() {
      return UserStorage.data.userId;
    },
    logout() {
      UserStorage.data.userId = null;
      UserStorage.data.userName = null;
      UserStorage.data.email = null;
      UserStorage.data.givenName = null;
      UserStorage.data.familyName = null;
    }
  }
};

export default UserStorage;
