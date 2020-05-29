<template>
    <section class="container">
        <div class="title-container">
            <h1>Your Profile</h1>
        </div>

        <div class="content profile-content">
            <div class="content-container">
                <div class="profile-row">
                    <label for="name">Name: </label>
                    <input type="text" v-model="userData.name" :placeholder="$root.store.User.name" :disabled="!isEditing" id="name"/>
                </div>
                <div class="profile-row">
                    <label>Email: </label>
                    <input type="text" v-model="userData.email" :placeholder="$root.store.User.email" :disabled="!isEditing" />
                </div>
            </div>
            <!-- <button @click="!isEditing">Edit</button> -->
        </div>
    </section>
</template>


<script>
export default {
    data() {
        return {
            userData: {
                name: this.$root.store.User.name,
                email: this.$root.store.User.email
            },
            isEditing: false
        }
    }
}
</script>