<template>
  <div class="modal">
    <div class="modal-body">
      <Register v-if="!returningUser"></Register>
      <Login v-else></Login>
    </div>
    <div class="modal-footer">
      <p v-if="!returningUser">
        Already have an account?
        <a class="underline" @click="returningUser = true">Click here to login.</a>
      </p>
      <p v-else>
        Don't have an account yet?
        <a class="underline" @click="returningUser = false">Click here to create an account.</a>
      </p>
    </div>
  </div>
</template>

<script>
import Login from "../components/Login";
import Register from "../components/Register";

export default {
  components: {
    Login,
    Register
  },
  data() {
    return {
      returningUser: JSON.parse(localStorage.getItem('hasLoggedFb'))
    };
  }
};
</script>