<template>
  <div class="Queue">
    <h1>Welcome to the Queue page</h1>
    <br />
    <h2>Your UserID is : {{uid}}</h2>
    <br />
    <h2>You are in Store : {{storeId}}</h2>
    <div v-if="isUserLoaded">
      <div v-if="!isUserEnrolled">
        <h2>The size of the queue is : {{queueLength}}</h2>
        <h2>The waiting time for this queue is: {{waitingTime}}</h2>
      </div>
      <div v-else>
        <h2>Your position in the queue is : {{queuePosition}}</h2>
        <h2>Your waiting time is: {{waitingTime}}</h2>
      </div>
      <br />
      <br />
      <br />
      <h1 class="head">Current Queue Status</h1>
      <p>(People before token {{starttoken}} have been resolved)</p>
      <br />
      <line-chart
        class="container is-fluid is-8"
        :data="graph"
        xtitle="Token range"
        ytitle="Number of people resolved"
      ></line-chart>
      <br />
      <br />
      <button :disabled="isUserEnrolled" @click="enterQueue">Enter Queue</button>
      <br />
      <br />
      <button :disabled="!isUserEnrolled" @click="exitQueue">Leave Queue</button>
    </div>
    <br />
    <br />
    <p>
      <router-link :to="{ name: 'Home' }">Back</router-link>
    </p>
  </div>
</template>

<script>
import firebase from "firebase";
import { database_call } from "../database.js";
import { waiting_time } from "../waitingtime.js";
// @ is an alias to /src

export default {
  name: "Queue",
  components: {},
  data() {
    return {
      storeId: this.$route.params.StoreId,
      uid: null,
      currentUserKey: null,
      currentStoreKey: null,
      isUserLoaded: false,
      isUserEnrolled: false,
      queueLength: 0,
      queuePosition: 0,
      waitingTime: 0,
      starttoken: 0,
      graph: [],
      point: []
    };
  },
  methods: {
    logout: function() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.replace("login");
        });
    },
    userInit: function() {
      //Function to populate intial data values
      let dbRef = firebase.database().ref();
      this.uid = firebase.auth().currentUser.uid;
      var that = this;
      dbRef
        .child(database_call.getStorePath(this.uid))
        .orderByChild("StoreID")
        .equalTo(this.storeId)
        .once("value", snapshot => {
          waiting_time.getWaitingTime(that.storeId, that.uid, function(
            waitingTime
          ) {
            that.waitingTime = waitingTime;
          });
          if (snapshot.exists()) {
            that.isUserEnrolled = true;
            database_call.getQueuePosition(that.storeId, that.uid, function(
              queuePosition
            ) {
              that.queuePosition = queuePosition;
            });
            database_call.getCurrentUserKey(that.storeId, that.uid, function(
              currentUserKey
            ) {
              that.currentUserKey = currentUserKey;
            });
            database_call.getCurrentStoreKey(that.storeId, that.uid, function(
              currentStoreKey
            ) {
              that.currentStoreKey = currentStoreKey;
            });
          } else {
            that.isUserEnrolled = false;
          }
          that.isUserLoaded = true;
        });
    },
    enterQueue: function() {
      let dbRef = firebase.database().ref();
      //Enter User to Queue
      this.queuePosition = this.queueLength + 1;
      var currentUserRef = dbRef
        .child(database_call.getUserPath(this.storeId))
        .push();
      this.currentUserKey = currentUserRef.key;
      currentUserRef.set({
        UserID: this.uid
      });
      this.isUserEnrolled = true;

      //Enter StoreID to SubscribedStoreID
      var currentStoreRef = dbRef
        .child(database_call.getStorePath(this.uid))
        .push();
      this.currentStoreKey = currentStoreRef.key;
      currentStoreRef.set({
        StoreID: this.storeId
      });
    },
    exitQueue: function() {
      let dbRef = firebase.database().ref();
      //Remove User from Queue
      dbRef
        .child(
          database_call.getUserPath(this.storeId) + "/" + this.currentUserKey
        )
        .remove();
      this.isUserEnrolled = false;

      //Remove StoreID from SubscribedStoreID
      dbRef
        .child(
          database_call.getStorePath(this.uid) + "/" + this.currentStoreKey
        )
        .remove();
    },
    queueInc: function(snap) {
      console.log("f called");
      this.queueLength += snap.numChildren();
    },
    queueDec: function(snap) {
      //Decrementing Queue Length
      this.queueLength -= snap.numChildren();

      //Decrementing Queue Position
      if (this.isUserEnrolled) {
        var currentKey = this.currentUserKey;
        if (snap.numChildren() == 1) {
          if (currentKey > snap.key) {
            this.queuePosition--;
          }
        } else {
          snap.forEach(function(childSnap) {
            if (currentKey > childSnap.key) {
              this.queuePosition--;
            }
          });
        }
      }
    },
    makegraph: function() {
      let dbref = firebase.database().ref();
      dbref
        .child("Store/" + this.storeId + "/UsersInQueue")
        .on("value", snap => {
          var linegraph = [];
          var firsttoken = 0;
          var lasttoken = 0;
          var temp = 0;
          snap.forEach(function(child) {
            if (temp == 0) {
              firsttoken = child.child("TokenId").val();
            } else firsttoken = Math.min(firsttoken, child.child("TokenId").val());
            lasttoken = Math.max(lasttoken, child.child("TokenId").val());
            temp++;
          });
          this.starttoken = firsttoken;
          var range = 20;
          range = Math.ceil((lasttoken - firsttoken) / 10);
          range = 20;

          firsttoken = firsttoken - (firsttoken % range);
          var counter = 0;
          var multi = firsttoken / range + 1;
          var l, r, left, right, key, value;
          snap.forEach(function(child) {
            if (child.child("TokenId").val() <= range * multi) counter++;
            else {
              r = range * multi;
              l = range * (multi - 1);
              left = l.toString();
              right = r.toString();
              key = left + "-" + right;
              value = range - counter;
              var pair = [];
              pair.push(key);
              pair.push(value);
              linegraph.push(pair);
              counter = 0;
              multi++;
              while (child.child("TokenId").val() > multi * range) {
                r = range * multi;
                l = range * (multi - 1);
                left = l.toString();
                right = r.toString();
                value = range - counter;
                key = left + "-" + right;
                var pair1 = [];
                pair1.push(key);
                pair1.push(value);
                linegraph.push(pair1);
                multi++;
              }
              counter = 1;
            }
          });
          r = range * multi;
          l = range * (multi - 1);
          left = l.toString();
          right = r.toString();
          key = left + "-" + right;
          value = range - counter;
          var pair2 = [];
          pair2.push(key);
          pair2.push(value);
          linegraph.push(pair2);
          this.graph = linegraph;
        });
    }
  },
  created() {
    this.userInit();
  },
  mounted() {
    //Listening to changes in the queue
    let dbRef = firebase.database().ref();
    dbRef
      .child(database_call.getUserPath(this.storeId))
      .on("child_added", this.queueInc);
    dbRef
      .child(database_call.getUserPath(this.storeId))
      .on("child_removed", this.queueDec);
    this.makegraph();
  }
};
</script>
