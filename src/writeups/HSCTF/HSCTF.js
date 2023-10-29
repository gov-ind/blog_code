import React, { Component } from "react";
import Latex from "react-latex";
import Code from "../../components/CodeBlock";
import Title from "../../components/Title";
import fig1 from "./fig1.png";
import fig2 from "./fig2.png";
import fig3 from "./fig3.png";
import fig4 from "./fig4.png";
import fig5 from "./fig5.png";
import fig6 from "./fig6.png";
import fig7 from "./fig7.png";

const code1 = `def dfs(houses, level=0, arr_min=1, arr_max=8):
    if level == arr_max - 1:
        most_common = Counter(houses).most_common(1)[0][0]
        prob = 1 - houses.count(most_common) / len(houses)
        return [most_common], prob

    uniq_houses = list(set(houses))
    probs = []

    for house in uniq_houses:
        if level == 0:
            print(house)
        prob = 1 - houses.count(house) / len(houses)

        next_houses = []
        for i in houses:
            if i == house: continue
            if i != arr_min:
                next_houses.append(i - 1)
            else:
                next_houses.append(i + 1)
            if i != arr_max:
                next_houses.append(i + 1)
            else:
                next_houses.append(i - 1)
           
        _next_houses, next_prob = dfs(next_houses,
                                      level=level + 1,
                                      arr_min=arr_min,
                                      arr_max=arr_max)
        probs.append(([house] + _next_houses, prob * next_prob))

    probs = sorted(probs, key=lambda a: a[1])
    return probs[0]`;

const code2 = `def _simulate(start):
    if randint(0, 1) == 0:
        if start == 8:
            return 7
        return start + 1
    if start == 1:
        return 2
    return start - 1

def simulate():
    trials = []
    for _ in range(200):
        houses = []
        start = randint(1, 8)
        for __ in range(8):
            start = _simulate(start)
            houses.append(start)

        trials.append(houses)
    return trials

def evaluate(trial, guesses):
    correct_count = 0

    for houses in trial:
        if 0 in [a ^ b for a, b in zip(houses, guesses)]:
            correct_count += 1

    return correct_count

guesses, probs = dfs(houses)

samples = []
for _ in range(1000):
    trials = simulate()
    samples.append(evaluate(trials, guesses))

print(f'Mean: sum(samples) / len(samples)')
print(f'Max: max(samples)')`;

const code3 = `def find_num_deadlocked_nodes(test):
    good_nodes = set()
    deadlocked_nodes = set()

    for idx, target in enumerate(test):
        if idx in good_nodes:
            good_nodes.add(idx)
            continue

        visited = [idx]
        next_idx = target - 1

        while True:
            if next_idx in good_nodes or next_idx in deadlocked_nodes:
                good_nodes |= set(visited)
                break

            if next_idx in visited:
                good_nodes |= set(visited)

                split_idx = visited.index(next_idx)
                _deadlocked_nodes = set(visited[split_idx:])

                deadlocked_nodes |= _deadlocked_nodes

                break

            visited.append(next_idx)
            next_idx = test[next_idx] - 1

    return len(deadlocked_nodes)`;

const code4 = `class Solver():
    def __init__(self):
        self.memo = {}

    def add_to_memo(self, a, b, val):
        if a not in self.memo:
            self.memo[a] = {}
        self.memo[a][b] = val

    def get_from_memo(self, a, b):
        if a in self.memo and b in self.memo[a]:
            return self.memo[a][b]
        return None

    def subset_sum(self, remaining, coins, start_idx=0, sols=[]):
        if remaining < 0:
            return False
        if remaining == 0:
            return True

        if start_idx == len(coins):
            self.add_to_memo(remaining, start_idx, False)
            return False

        from_memo = self.get_from_memo(remaining - coins[start_idx],
                                       start_idx)
        if from_memo: return from_memo

        sol_exists = self.subset_sum(remaining - coins[start_idx],
                                     coins,
                                     start_idx=start_idx + 1,
                                     sols=sols)
       
        if sol_exists:
            sols.append(coins[start_idx])
            return True

        self.add_to_memo(remaining - coins[start_idx], start_idx, False)

        from_memo = self.get_from_memo(remaining, start_idx)
        if from_memo: return from_memo

        sol_exists = self.subset_sum(remaining, coins,
                                     start_idx=start_idx + 1, sols=sols)

        self.add_to_memo(remaining, start_idx, sol_exists)

        return sol_exists`;

const code5 = `def solve(items, coins):
    results = []

    for i, item in enumerate(items):
        sols = []
        
        if not Solver().subset_sum(item + randint(0, 1), coins, 0, sols=sols):
            spare_coins = sum(coins) - sum(items[i:])
            for extra_coin in range(1, spare_coins + 1):
                sols = []
                if Solver().subset_sum(item + extra_coin, coins, 0, sols=sols):
                    break
            else:
                return False

        results.append(sols)

        for coin in sols:
            coins.remove(coin)

    return results`;

const code6 = `def _solve(items, coins):
    i = 1
    while True:
        print(f'Attempt: {i}')
        
        sol = solve(items.copy(), coins.copy())
        
        if sol:
            return sol
        
        print('Attempt failed')
        i += 1`;

const code7 = `for i in range(100):
    sock.sendall(str(i).encode() + b'\\n')`;

const code8 = `payload = b''
for i in range(100):
    payload += str(i).encode() + b'\\n'
    
sock.sendall(payload)`;

const m1 = "$\\overline{X}$";
const m2 = "$P(\\overline{X}; [h_1, h_2, h_3, h_4])$";
const m3 = "$h_1, h_2, h_3, h_4$";
const m4 = "$P_n(\\overline{X}; h_n)$";
const m5 =
  "$P(X; [2, 2, 3, 3]) = 1 - P(\\overline{X}; [2, 2, 3, 3]) = 1 - P_1(\\overline{X}; 2) \\cdot P_2(\\overline{X}; 2) \\cdot P_3(\\overline{X}; 3) \\cdot P_4(\\overline{X}; 3)$";
const m6 = "$P_1(\\overline{X}, 2) = \\frac{3}{4}$";
const m7 = "$P_2(\\overline{X}, 3) = \\frac{3}{6}$";
const m8 =
  "$1 - \\frac{3}{4} \\cdot \\frac{3}{6} \\cdot \\frac{4}{6} \\cdot \\frac{2}{8} = 0.9375$";
const m9 =
  "$\\sum_{i=0}^{n} \\epsilon_n \\leq \\sum_{i=0}^{m} C_i + \\sum_{n=0}^{n} I_n$";

class HSCTF extends Component {
  render() {
    return (
      <div className="content">
        <Title
          title={this.props.title}
          date={this.props.date}
          cat={this.props.cat}
        />
        <p>
          <b>Description. </b>This week I played in a team for the first time
          with idek at HSCTF and we came in third place! We managed to solve all
          the algorithm challenges, so here are brief writeups for three of
          them, <a href="#tunnels">Tunnels</a>,{" "}
          <a href="#hacking">Hacking: Part 1</a>, and{" "}
          <a href="#vending">Vending Machine: Part 2</a>.
        </p>
        <h2 className="subtitle2" id="tunnels">
          Tunnels:
        </h2>
        <p>
          <b>Description. </b>
          <a href="https://github.com/gov-ind/ctf_solves/raw/main/2022/hsctf/tunnels/Tunnels.pdf">
            Here's
          </a>{" "}
          the PDF describing the challenge.
        </p>
        <p>
          <b>Analysis. </b>Let's first look at a simpler version of the problem
          where there are only 4 houses in a row. Here it seems intuitive that
          guessing either 2 or 3 over four rounds will catch the robber with a
          high probability.
        </p>
        <p>
          Let's recap what this probability is: The probability that we make a
          correct guess 4 rounds is 1 minus the probability that we don't make a
          correct guess each round. If we let <Latex>{m1}</Latex> to be the
          event that we do not make a correct guess over four rounds,{" "}
          <Latex>{m2}</Latex> to be the probability that we don't make a correct
          guess over four rounds with <Latex>{m3}</Latex> as our guesses, and{" "}
          <Latex>{m4}</Latex>to be the probability that we don't make a correct
          guess in round <Latex>$n$</Latex> with a guess of <Latex>$h_n$</Latex>
          , then, for a sequence of guesses 2, 2, 3, 3, we have:
        </p>
        <div className="center-eq">
          <Latex>{m5}</Latex>
        </div>
        <p>
          Let's walk through this example so that the formula makes more sense.
          In round 1, the robber could be in any one of four houses, so we might
          as well guess any house. Let's say we guess house 2 so that{" "}
          <Latex>{m6}</Latex> (in other words, there's a 75% chance we are
          wrong). Now there are two possibilities: Either our guess was correct,
          in which case we are done with this round, or we are wrong, in which
          case the robber will be in an adjacent house in the next round.
        </p>
        <p>
          More concretely, if the robber were actually in house 1, there's a
          100% chance he's now in house 2. If he were in house 3, there's a 50%
          chance he's now in either house 2 or 3. If he were in house 4, there's
          a 100% chance he's in house 3. We can visualize this as follows:
        </p>
        <div className="image-wrapper-3 m-r-7">
          <img className="image" src={fig1} />
        </div>
        <p>
          Seeing that it is more probable that the robber is now in house 2,
          let's be greedy and guess house 2 this time. Three out of the six
          possible houses are house 2, so there's a 50% chance that we make a
          wrong guess (<Latex>{m7}</Latex>).
        </p>
        <div className="image-wrapper-3 m-r-5">
          <img className="image" src={fig2} />
        </div>
        <p>
          If we continue with this greedy approach (whenever possible), we'll
          end up with an success rate of about 94% (<Latex>{m8}</Latex>).
        </p>
        <div className="image-wrapper-3 m-r-5">
          <img className="image" src={fig3} />
        </div>
        <p>
          Is this best we can do? Not quite: The sequence 2, 3, 2, 2 gives a
          success rate of 100%.
        </p>
        <div className="image-wrapper-3 m-r-5">
          <img className="image" src={fig4} />
        </div>
        <p>
          Clearly, a greedy approach won't do. We have to modify our algorithm
          to explore all possible guesses before making a guess and pick the one
          with the minimum probability of being a wrong guess. For this, we can
          write a depth-first search as follows.
        </p>
        <Code>{code1}</Code>
        <p>
          Finally, we can do a quick local simulation and verify that the our
          mean score over 200 trials is about 180 and our max score is close to
          190. This is enough to get the flag.
        </p>
        <Code>{code2}</Code>
        <p>
          <a href="https://github.com/gov-ind/ctf_solves/raw/main/2022/hsctf/tunnels/solve.py">
            Here's
          </a>{" "}
          the full solve script.
        </p>
        <h2 className="subtitle2" id="hacking">
          Hacking: Part 1:
        </h2>
        <p>
          <b>Description. </b>
          <a href="">Here's</a> the PDF describing the challenge.
        </p>
        <p>
          <b>Analysis. </b>Let's approach this problem by modelling each hacker
          and the flow of their virus as a node and an edge respectively in a
          directed graph. Knowing that each hacker can transmit their virus to
          only one other hacker, the number of possible graph structures is only
          three. One of them is shown below.
        </p>
        <div className="image-wrapper-3">
          <img className="image" src={fig5} />
        </div>
        <p>
          Here, the nodes 3, 4, 5, and 6 are in a "deadlock", and any virus
          transmitted by one of these nodes pass through that node again. To
          find cycles like this, the idea is simple: Start at any node and keep
          traversing along the node it points to, adding each node to an array,
          say, <span className="code-block">visited</span>. If at any point, the
          next node is already in <span className="code-block">visited</span>,
          then we have detected a cycle beginning and ending at that node.
        </p>
        <p>
          To keep track of the nodes that are in a cycle, we'll need two sets,
          say, <span className="code-block">good_nodes</span> and{" "}
          <span className="code-block">deadlocked_nodes</span>, to store the
          nodes not in a cycle and the nodes in a cycle respectively. We'll then
          split <span className="code-block">visited</span> at the node that
          starts the cycle: Every node to the left of the split goes in to{" "}
          <span className="code-block">good_nodes</span> and every node to the
          right of the split (inclusive) goes in to{" "}
          <span className="code-block">deadlocked_nodes</span>. In our example,
          by the time we have traversed 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 3, we will
          see that node 3 is already in{" "}
          <span className="code-block">visited</span>, so we split at node 3, so
          that <span className="code-block">good_nodes</span> will be {"{1, 2}"}{" "}
          and <span className="code-block">deadlocked_nodes</span> will be{" "}
          {"{3, 4, 5, 6}"}.
        </p>
        <p>The other structures could be the following.</p>
        <div className="image-wrapper-3">
          <img className="image" src={fig6} />
        </div>
        <div className="image-wrapper-3">
          <img className="image" src={fig7} />
        </div>
        <p>
          Here, node 10 points to a node that is either not in a cycle (ie., in{" "}
          <span className="code-block">good_nodes</span>) or in one (ie., in{" "}
          <span className="code-block">deadlocked_nodes</span>). In either case,
          it is easy to see that the nodes from 7 through to 10 will not be in a
          cycle. If we ever come across a path like this, we simply add all the{" "}
          <span className="code-block">visited</span> nodes to{" "}
          <span className="code-block">good_nodes</span>.
        </p>
        <p>
          Now that we know the edge cases, it is straightforward to write the
          following linear-time function to find cycles (
          <a href="https://github.com/gov-ind/ctf_solves/raw/main/2022/hsctf/hacking/solve.py">
            Here's
          </a>{" "}
          the full solve script).
        </p>
        <Code>{code3}</Code>
        <h2 className="subtitle2" id="vending">
          Vending Machine: Part 1:
        </h2>
        <p>
          <b>Description. </b>
          <a href="https://github.com/gov-ind/ctf_solves/raw/main/2022/hsctf/vending_machine/Vending_Machine.pdf">
            Here's
          </a>{" "}
          the PDF describing the challenge.
        </p>
        <p>
          As per my understanding, this is a variation of the{" "}
          <a href="https://en.wikipedia.org/wiki/Bin_packing_problem">
            bin packing problem
          </a>{" "}
          (although I've heard people refer to it as a "multi-knapsack problem"
          too). Given a list of items <Latex>$I_1, I_2, \ldots I_n$</Latex> and
          coins <Latex>$C_1, C_2, \ldots C_m$</Latex>, for each item{" "}
          <Latex>$I_n$</Latex>, we must find a subset of coins{" "}
          <Latex>$C_1, C_2, \ldots C_k$</Latex> such that they sum up to{" "}
          <Latex>$I_n$</Latex>, plus a small <Latex>$\epsilon$</Latex>. Note
          that there is a constraint on <Latex>$\epsilon$</Latex>, namely{" "}
          <Latex>{m9}</Latex>.
        </p>
        <p>
          It is straightforward to write a DP-based memoized subset sum solver
          that, given an item and a list of coins, finds the subset of coins
          that sum up to the item.
        </p>
        <Code>{code4}</Code>
        <p>
          However, there are two complications. First, the fact that the sum of
          the coins need not exactly equal to the item means that for each item
          and list of coins, we have to try different sums. Second, once a
          subset of coins is used to buy a certain item, none of them can be
          used to buy any subsequent items.
        </p>
        <p>
          After a lot of experimentation, I came up with the following procedure
          to work around these issues: For each item and list of coins, randomly
          set <Latex>$\epsilon$</Latex> to 0 or 1 and check if there's a subset
          of coins that can buy <Latex>item + $\epsilon$</Latex>. If there is,
          we're good: Remove this subset of coins from the list of coins and run
          this procedure for the next item. If there exists no subset, then loop{" "}
          <Latex>$\epsilon$</Latex> from 1 to its limit (the difference between
          the sum of coins and sum of the remaining items to buy) and check if
          there's a subset. If this fails too, return{" "}
          <span className="code-block">False</span>.
        </p>
        <Code>{code5}</Code>
        <p>
          If the above procedure fails, then it means that our randomization
          didn't work, so keep retrying till it succeeds.
        </p>
        <Code>{code6}</Code>
        <p>
          The only other issue I faced was that it took too long to send my
          payloads line-by-line, resulting in my connection getting reset. To
          fix this, I simply batched my requests, so that something like this:
        </p>
        <Code>{code7}</Code>
        <p>Became this:</p>
        <Code>{code8}</Code>
        <p>
          <a href="https://github.com/gov-ind/ctf_solves/raw/main/2022/hsctf/vending_machine/solve.py">
            Here's
          </a>{" "}
          the full solve script.
        </p>
        <p>&nbsp;</p>
      </div>
    );
  }
}

export default HSCTF;
