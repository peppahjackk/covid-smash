<template>
  <div class="modal">
    <div class="modal-body">
      <Register v-if="newUser"></Register>
      <Login v-else></Login>
    </div>
    <div class="modal-footer">
      <p v-if="newUser">
        Already have an account?
        <a class="underline" @click="newUser = false">Click here to login.</a>
      </p>
      <p v-else>
        Don't have an account yet?
        <a class="underline" @click="newUser = true">Click here to create an account.</a>
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
      newUser: true
    };
  }
};
</script>