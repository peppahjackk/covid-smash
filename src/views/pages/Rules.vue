<template>
  <section class="container">
    <div class="title-container">
      <h1 class="title">COVID Smash</h1>
      <h2>Rules</h2>
    </div>
    <div class="intro-text content bg-baseAccent">
        <h3>Ever since the COVID-19 isolation period began, the landscape of indoors future of spectator sports has changed forever. We bring you all the rage: CPU controlled Super Smash Bros. matches! Before the fights begin, pick who you think will come out on top of the bout. <a @click="$router.push({path:'/rules'})" class="underline">Read the full rules</a>.</h3>
    </div>
    <div class="content flex-content flex-top bg-baseAccent">
      <div class="content-left">
        <h3>How to play:</h3>
        <ul>
          <li>Choose who you think will win one or all of the following Smash Bros. matches.</li>
          <li>You can change your pick after submitting. Just select a new fighter in the match and submit again</li>
          <li>You are not required to pick every match</li>
        </ul>
      </div>
      <div class="match-rules content-left">
        <h3>Match Rules:</h3>
        <ul>
          <li>Game and system will be listed</li>
          <li>All characters are CPU controlled (max level*)</li>
          <li>4 player free-for-all*</li>
          <li>6 stock* (no time limit)</li>
          <li>Items are OFF*</li>
          <li>Stage selection listed in match description</li>
          <li>Last man/woman/pokemon standing wins*</li>
        </ul>
        <h5>*unless otherwise stated</h5>
      </div>
    </div>

    <button @click="$router.push({ path: '/' })">Make some picks!</button>
  </section>
</template>