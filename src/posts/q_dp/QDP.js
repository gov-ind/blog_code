import React, { Component } from 'react';
import Code from '../../CodeBlock';
import Title from '../../Title';
import Tex from '../../Tex';

import one_step from './one_step.png';
import two_step from './two_step.png';
import bsw from './bsw.png';

const code1 = `# states = [0, 1, 2]

policy = {
    0: [(-1, 1 / 2), (0, 1 / 3), (1, 1 / 6)],
    1: [(-1, 1 / 2), (0, 1 / 3), (1, 1 / 6)]
}

def find_proportion(policy, current_state=1, target_state=2, steps=3):
    if current_state == target_state:
        return 1
    if current_state < 0 or current_state > target_state or steps == 0:
        return 0

    total_proportion = 0
    for direction, proportion in policy[current_state]:
        total_proportion += proportion * find_proportion(
            policy,
            current_state + direction,
            steps=steps - 1
        )

    return total_proportion`;

const code2 = `# states = [0, 1, 2]

# Our policy is a list of tuples, where each tuple
# specifies the direction to move, and the probability
# with which to make that move
policy = {
    0: [(-1, 1 / 2), (0, 1 / 3), (1, 1 / 6)],
    1: [(-1, 1 / 2), (0, 1 / 3), (1, 1 / 6)]
}

def find_proportion(policy, n_states=3, target_state=2, steps=100):
    proportions = [0. for _ in range(n_states - 1)] + [1.]

    for _ in range(steps):
        next_proportions = [a for a in proportions]
        for current_state in range(n_states - 1):
            total_proportion = 0
            for direction, proportion in policy[current_state]:
                next_state = current_state + direction
                # ignore black holes
                if next_state < 0 or next_state > target_state:
                    continue
                total_proportion += proportion * proportions[next_state]
            next_proportions[current_state] = total_proportion
        proportions = next_proportions
    
    return proportions`;

const code3 = `import gym
import numpy as np

custom_map = [
    'HFFSFFG'
]

env = gym.make("FrozenLake-v1", render_mode="ansi", desc=custom_map)

# Hack the state transition probabilities
def patch_tuple(tup, i, v):
    l = list(tup)
    l[i] = v
    return tuple(l)

for state in env.P:
    for action in env.P[state]:
        if len(env.P[state][action]) == 1:
            continue
        if action == 1 or action == 3:
            env.P[state][action][0] = patch_tuple(env.P[state][action][0], 0, 1 / 2)
            env.P[state][action][1] = patch_tuple(env.P[state][action][1], 0, 1 / 3)
            env.P[state][action][2] = patch_tuple(env.P[state][action][2], 0, 1 / 6)

policy = {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1
}

def evaluate_policy(policy, env, theta=1e-10):
    n_states = env.observation_space.n
    q = np.array([0. for _ in range(n_states - 1)] + [1.])

    while True:
        new_q = q.copy()

        for current_state in range(n_states - 1):
            if current_state not in policy:
                continue
            action = policy[current_state]
            total_proportion = 0
            for proportion, next_state, reward, done in env.P[current_state][action]:
                total_proportion += proportion * reward
                if not done:
                    total_proportion += proportion * q[next_state]
            new_q[current_state] = total_proportion
        
        if np.abs(q - new_q).max() <= theta:
            break

        q = new_q
    
    return q`;

const eq1 = 'p_{t + 1}';
const eq2 = '\\pi';
const eq3 = '\\gamma';
const eq4 = `\\begin{aligned}
p_1(0) &= 0 \\\\
p_1(1) &= 1/6\\\\
p_1(2) &= 1\\\\\\\\
p_2(0) &= 1/3 \\cdot p_1(0) + 1/6 \\cdot p_1(1)\\\\
p_2(1) &= 1/2 \\cdot p_1(0) + 1/3 \\cdot p_1(1) + 1/6 \\cdot p_1(2)\\\\
p_2(2) &= 1\\\\\\\\
p_3(0) &= 1/3 \\cdot p_2(0) + 1/6 \\cdot p_2(1)\\\\
p_3(1) &= 1/2 \\cdot p_2(0) + 1/3 \\cdot p_2(1) + 1/6 \\cdot p_2(2)\\\\
p_3(2) &= 1
\\end{aligned}`;
const eq5 = 'p_{t + 1}(c) = P(c - 1 | c) \\cdot p_t(c - 1) + P(c | c) \\cdot p_t(c) + P(c + 1 | c) \\cdot p_t(c + 1)';
const eq6 = 'p_{t + 1}(s) = \\sum\\limits_{s^\\prime \\in S} P(s^\\prime | s) \\cdot p_t(s^\\prime)';
const eq7 = `\\begin{aligned}
v_{t + 1} &= \\sum\\limits_{a} \\pi(a | s) \\sum\\limits_{s^\\prime, r} P(s^\\prime, r | s, a) \\cdot (r + \\gamma v_t(s^\\prime)) && \\forall s \\in S \\\\
q_{t + 1} &= \\sum\\limits_{s^\\prime, r} P(s^\\prime, r | s, a) \\cdot (r + \\gamma q_t(s^\\prime)) && (\\text{a is a constant, so } v_t \\text{ reduces to } q_t) \\\\
q_{t + 1} &= \\sum\\limits_{s^\\prime} P(s^\\prime | s) \\cdot q_t(s^\\prime) && (\\text{substituting } \\gamma = 1 \\text{ and } r = 0) \\\\
\\end{aligned}`;
const eq8 = `\\begin{aligned}
p_1(0) &= 0 \\\\
p_1(1) &= 1/6\\\\
p_1(2) &= 1\\\\\\\\
\\end{aligned}`
const eq9 = `\\begin{aligned}
p_2(1) &= 1/2 \\cdot p_1(0) + 1/3 \\cdot p_1(1) + 1/6 \\cdot p_1(2) \\\\
&= 1/2 \\cdot 0 + 1/3 \\cdot 1/6 + 1/6 \\cdot 1 && (\\text{substituting each } p_1 \\text{ as we already calculated it for } t = 1) \\\\
&= 1/3 \\cdot 1/6 + 1/6
\\end{aligned}`

export default class extends Component {
  render() {
    return (      
        <div className='content'>
          <Title title={this.props.title} date={this.props.date} cat={this.props.cat} />
          <p>In the world of reinforcement learning (RL), the Bellman equation is fundamental to efficiently calculating Q-values. However, outside of RL, the Bellman equation is most commonly associated with dynamic programming. Is it the same equation? As someone who recently started studying RL, I was curious to know what the link between the two, if any, is with a concrete example. In this blog post, I'll start with a standard algorithmic problem, solve it using dynamic programming, and show that the algorithm calculates Q-values using a special case of the Bellman equation.
          </p>
          <p>
          We'll be solving a variation of a problem in the Bandit Slippery Walk environment as described in the excellent book <a href='https://www.manning.com/books/grokking-deep-reinforcement-learning'>Grokking Deep Reinforcement Learning</a> by Miguel Morales (which, by the way, is the best book to intuitively understand RL, in my opinion). Here's the problem statement: There is a row with three cells. A million robots are placed in the second cell. On each of the first two cells, the robots will move towards the left cell with a probability of <Tex>1/2</Tex>, towards the right cell with a probability of <Tex>1/6</Tex>, and stay on the same cell with a probability of <Tex>1/3</Tex>. If the robot takes a left in the left-most cell, it falls into a black hole and is lost for ever. If each robot is allowed to take at most t steps, how many robots will reach the third cell, the target? Note: It's also possible to rephrase this question in a non-frequentist way, like "what proportion of the robots will reach the target?": This avoids having to worry about the number of robots involved.
          </p>
          <div className='image-wrapper-5' style={{ marginTop: '2em' }}>
            <div className='image-subwrapper'>
              <img src={bsw} alt="Figure 1: The environment\'s transitions" />
            </div>
            <b style={{ marginTop: '2em' }}>Figure 1: The environment's transitions</b>
          </div>
          <p>
          Let's first quickly review some RL-related terminology in this problem. The cells are the environment, the robot is the agent, and the probabilities of moving to neighbouring cells or staying in the current cell comprise the policy (well, not exactly<b>*</b>). The cell at which the robot is at a point in time is called the state, and the third cell, the target, where the agent receives a reward of 1, is the terminal state. Finally, the sequence of states and rewards over <span className='code-block'>t</span> steps is called an episode.
          </p>
          <p className='box'>
          <b>*</b>Technically, these probabilities arise due to the stochasticity of the slippery environment and not due to the policy. The policy here instructs the agent to take the same action, i.e., to go left, in each state.
          </p>
          <p>
          For robots that start at cell <span className='code-block'>c</span> and are allowed to take <span className='code-block'>t</span> steps, let us denote by <Tex>p_t(c)</Tex> the proportion of robots that reach the target. In the simplest scenario, when <span className='code-block'>t = 1</span>, it's clear (from Figure 2) that only <Tex>1/6</Tex> of the robots will reach the target starting from cell 1, so that <Tex>p_1(1) = 1/6</Tex>. For each cell, we have the following proportions:
          </p>
          <p>
            <Tex>{eq8}</Tex>
          </p>
          <div className='image-wrapper-5'>
            <div className='image-subwrapper'>
              <img src={one_step} alt="Figure 2: The search space for t = 1" />
            </div>
            <b>Figure 2: The search space for <span className='code-block'>t = 1</span></b>
          </div>
          <p>
          When <span className='code-block'>t {'>'} 1</span>, we'll need to do a Depth-First Search (DFS) over all the possible paths (as illustrated in Figure 3) that the robot can traverse starting at cell 1. For <span className='code-block'>t = 2</span>, we find that <Tex>p_2(1) = 1 / 3 \cdot 1 / 6 + 1 / 6</Tex>.
          </p>
          <div className='image-wrapper-5'>
            <div className='image-subwrapper'>
              <img src={two_step} alt="Figure 3: The search space for t = 2" />
            </div>
            <b>Figure 3: The search space for <span className='code-block'>t = 2</span></b>
          </div>
          <Code>{code1}</Code>
          <p>
          Of course, this isn't efficient (try running the algorithm for t = 100). The key insight in dynamic programming is that many problems consist of sub-problems that we've already solved. For example, the proportion of robots that reach the target starting from cell 1 in at most two steps is <Tex>1/3</Tex> times the proportion of robots that reach the target starting from cell 1 given at most one step, plus <Tex>1/6</Tex> times the proportion of robots that reach the target starting from cell 2 given at most one step. In other words,
          </p>
          <Tex>{eq9}</Tex>
          <p>
          Since we've already calculated each <Tex>p_t</Tex>, we don't need to recompute it when we calculate each <Tex>{eq1}</Tex>. A bottom-up DP algorithm would start by calculating <Tex>p_t</Tex> for each cell and using it to calculate <Tex>{eq1}</Tex>. In our case, these are the recurrences.
          </p>
          <p><Tex>{eq4}</Tex></p>
          <Code>{code2}</Code>
          <p>
          Note that the recurrence we calculate for any cell <span className='code-block'>c</span> and step <span className='code-block'>t</span>:
          </p>
          <Tex>{eq5}</Tex>
          <p>
          Can more generally be written as the following summation, where <Tex>S</Tex> is the set of all possible transitions for the current state and <Tex>P(s^\prime | s)</Tex> is the probability of transitioning to <Tex>s^\prime</Tex> from <Tex>s</Tex>.
          </p>
          <Tex>{eq6}</Tex>
          <p>
          <b>Eureka?</b> This is simply a special case of the Bellman equation to find the V-function where <Tex>{eq2}</Tex> is fixed (because we're evaluating a single policy), the reward <span className='code-block'>r</span> for all non-terminal states is 0, and <Tex>{eq3}</Tex> is 1. Each <Tex>p_t</Tex> we computed previously is just the <Tex>q_t</Tex> or Q-value of a state at time <span className='code-block'>t</span>.
          </p>
          <Tex>{eq7}</Tex>
          <p>
          Finally, we can rewrite the code to use a gym environment, act on the reward directly, and change the variable <span className='code-block'>proportions</span> to <span className='code-block'>q</span>. For reference, the algorithm used below is identical to the one used in <a href='https://www.manning.com/books/grokking-deep-reinforcement-learning'>Grokking Deep Reinforcement Learning</a>.
          </p>
          <Code>{code3}</Code>
          <p>
          <b>Conclusion.</b> After coming up with a concrete example and using a frequentist approach, this is the way I first think of Q-values now: In an environment with a single terminal state having the only non-zero reward, which is 1, it's the probability that an agent in a state following a policy will end in a successful terminal state. When we have access to the Markov Chain, we can build a good enough approximation of this probability by sampling from the chain <span className='code-block'>t</span> times.
          </p>
          <p>&nbsp;</p>
        </div>
    );
  }
};
