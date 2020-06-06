<template>
    <div class="col-md" @click="processTurn">
        <div class="card h-100" :class="cardClasses">
            <div class="card-body d-flex align-items-center h-100">
                <div class="text-center w-100">
                    <h4>{{ name }}</h4>
                    <h2>{{ timeLeft }}</h2>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'Game',
    props: ['name', 'strategy', 'active', 'paused'],
    data() {return {
        timeLeft: 0,
        timer: null,
    }},
    methods: {
        resetTimer(resetTime) {
            if (this.active && !this.paused) {
                if (resetTime) {
                    if (this.strategy.resetTimer) {
                        this.timeLeft = this.strategy.initialTime;
                    }

                    this.timeLeft += this.strategy.addedTime;
                }
                this.timer = setInterval(this.processTimer, 1000);
            } else {
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        processTimer() {
            this.timeLeft -= 1;
        },
        processTurn() {
            if (this.active) {
                this.$emit('nextturn');
            }
        },
        resetPlayer() {
            this.timeLeft = this.strategy.initialTime;
            this.resetTimer(true);
        }
    },
    computed: {
        cardClasses() {
            if (this.active) {
                if (this.paused) {
                    return ['text-white', 'bg-secondary'];
                } else if (this.timeLeft < 0) {
                    return ['text-white', 'bg-danger'];
                }

                return ['text-white', 'bg-info'];
            }

            return ['bg-light'];
        }
    },
    watch: {
        active() {
            this.resetTimer(true);
        },
        paused() {
            this.resetTimer(false);
        }
    },
    created() {
        this.resetPlayer();
    }
}
</script>