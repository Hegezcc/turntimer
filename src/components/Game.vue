<template>
    <div>
        <div id="askReset" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Reset game</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Do you really want to reset the game?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal" @click="reset">Reset</button>
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="settings" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Settings</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="settingsPlayers">Players</label>
                            <input v-model.number="playerCount" type="number" step="1" min="2" max="10" class="form-control" id="settingsPlayers" placeholder="Enter player count" required>
                        </div>
                        <div class="form-group">
                            <label for="settingsInitialTime">Time (seconds)</label>
                            <input v-model.number="strategy.initialTime" type="number" step="1" min="1" max="3600" class="form-control" id="settingsInitialTime" placeholder="Enter initial seconds per round" required>
                        </div>
                        <div class="form-group">
                            <label for="settingsAddedTime">Time added each round (seconds)</label>
                            <input v-model.number="strategy.addedTime" type="number" step="1" min="-3600" max="3600" class="form-control" id="settingsAddedTime" placeholder="Enter seconds to add per round" required>
                        </div>
                        <div class="form-check">
                            <input v-model="strategy.resetTimer" type="checkbox" class="form-check-input" id="settingsResetTimer">
                            <label class="form-check-label" for="settingsResetTimer">Reset timer each round</label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-dismiss="modal">Save changes</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="game" class="container d-flex flex-column py-3">
            <div class="row mb-3">
                <div class="col d-flex justify-content-center">
                    <button type="button" class="btn btn-warning mr-1" :class="{ focus: paused }" @click="pause">Pause</button>
                    <button type="button" href="#" class="btn btn-secondary mr-1" @click="showSettings">
                        <font-awesome-icon :icon="['fas', 'cog']" />
                    </button>
                    <button type="button" class="btn btn-danger mr-1" @click="askReset">Reset</button>
                </div>
            </div>
            <div class="row flex-grow-1" id="playerCount">
                <Player v-for="p in playerCount" :name="'Player #' + p" :strategy="strategy"
                        :active="currentTurn === p" :key="p" :paused="paused"
                        @nextturn="processNextTurn" />
            </div>
        </div>
    </div>
</template>
<script>
import Player from './Player.vue';
export default {
    name: 'Game',
    components: { Player },
    props: ['time', 'players'],
    data() { return {
        currentTurn: 1,
        paused: true,
        settingsPrompt: false,
        playerCount: 0,
        strategy: {
            initialTime: 60,
            resetTimer: true,
            addedTime: 0,
        },
        localStorageStrategyKey: 'turntimer-strategy',
    }},
    methods: {
        processNextTurn() {
            if (this.currentTurn >= this.playerCount) {
                this.currentTurn = 1;
            } else {
                this.currentTurn += 1;
            }
        },
        pause() {
            this.paused = !this.paused;
        },
        onkey(ev) {
            const actions = {
                'p': this.pause,
                ' ': this.processNextTurn,
                'Enter': this.processNextTurn,
                's': this.showSettings,
                'r': this.askReset,
            };

            if (ev.key in actions) {
                ev.preventDefault();

                actions[ev.key]();
            }
        },
        showSettings() {
            this.paused = true;
            window.$('#settings').modal('toggle');
        },
        askReset() {
            this.paused = true;
            window.$('#askReset').modal('toggle');
        },
        reset() {
            this.currentTurn = 1;
            this.paused = true;

            this.$children.forEach(p => p.resetPlayer());
        },
        saveStrategy() {
            localStorage.setItem(this.localStorageStrategyKey, JSON.stringify(this.strategy));
        },
        loadStrategy() {
            if (this.localStorageStrategyKey in localStorage) {
                this.strategy = JSON.parse(localStorage.getItem(this.localStorageStrategyKey));
            }
        }
    },
    created() {
        window.addEventListener('keydown', this.onkey);
        this.strategy.initialTime = this.time;
        this.playerCount = this.players;

        this.loadStrategy();
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.onkey);
    },
    watch: {
        strategy: {
            deep: true,
            handler() {
                this.saveStrategy();
            }
        }
    }
}
</script>
<style scoped>
    #game {
        min-height: 100vh;
    }
</style>