import React, { Component } from 'react';
import Latex from 'react-latex';
import MathJax from 'react-mathjax2'
import Code from '../CodeBlock';
import ReactMarkdown from 'react-markdown';
import Title from '../Title';
import example from './example.png';
import fig0 from './fig0.png';
import fig1 from './fig1.png';
import fig2 from './fig2.png';
import fig3 from './fig3.png';
import fig4 from './fig4.png';
import fig5 from './fig5.png';
import fig6 from './fig6.png';
import bfs1 from './bfs1.png';
import bfs2 from './bfs2.png';
import bfs3 from './bfs3.png';
import bfs4 from './bfs4.png';
import bfs5 from './bfs5.png';

const sol2 = `end = 20
start = 0

def weighted_bfs(costs):
    paths = {
      0: [[0]]  # a dict mapping a cost to all the paths that have that cost
    }

    while len(paths) > 0:
        least_cost = sorted(paths)[0]

        for path in paths[least_cost]:
            # start from the last node in the route
            node = path[-1]
        
            if node == end:
                return least_cost

            for next_node in costs[node]:
                # avoid cyclic paths
                if next_node in path: continue

                next_cost = least_cost + costs[node][next_node]
                next_path = [path + [next_node]]
                
                if next_cost not in paths:
                    paths[next_cost] = next_path
                else:
                    paths[next_cost] += next_path

        del paths[least_cost]

    return -1`;
export default class extends Component {
  render() {
    return (
        <div className='content'>
          <Title title={this.props.title} date={this.props.date} cat={this.props.cat} />
          <p><b>Description. </b>This was a maze-solving challenge in TJCTF that could be solved by using a variation of the Breadth-First Search, so I thought it would be a good idea to visually introduce the algorithm. In the challenge, we're given up to 20 nodes and the distances between each pair of nodes. There are a total of 50 rounds, and for each round, the aim is to find the shortest path between node 0 and node 20.
          </p>
          <p><b>Sample Input:</b><br />
          0  1  5 <br />
          0  2  5 <br />
          1  20 3 <br />
          2  20 1 <br />
          </p>
          <p><b>Sample Output:</b><br />
          6
          </p>
          <p><b>Explanation. </b>Let's visualize the nodes and the paths between the nodes as a graph shown below:
          </p>
          <div className='image-wrapper-2'><img src={example} /></div>
          <p>Clearly, the shortest path (highlighted in red) between node 0 and node 20 (also highlighted in red) hops through node 2, and it is <Latex>$5 + 1 = 6$</Latex> units long.
          </p>
          <p><b>Attempt 1: Solve a simpler variation of the problem. </b>First, let's consider a slightly simpler variation where the distances between every pair of nodes is equal. In this variation, the problem, then, is to find the minimum number of hops between the start node and the end node. For example, consider the following graph:
          </p>
          <div className='image-wrapper-2'><img className='image' src={fig1} /></div>
          <p>The shortest path between the start node and end node hops through the nodes 1 and 5, giving us a total of 3 hops. We find this path using an algorithm called the Breadth-First Search which proceeds as follows.
          </p>
          <p>First, start at node 0 and "visit" each of its neighbours (1, 2, and 3). The important thing in a BFS is that we want to take <b>only one step</b> in every possible direction and no more. Here's what the graph would like like after this:
          </p>
          <div className='image-wrapper-2'><img className='image' src={fig2} /></div>
          <div className='queue'>
            Queue: 
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>1<br/>1</div>
            </div>
<div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>2<br/>1</div>
            </div>
<div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>3<br/>1</div>
            </div>
          </div>
          <p>You'll note that I also put the visited nodes and the distance travelled to reach each node (henceforth called "Cost") in a queue. This because we next want to go to each of the previously visited neighbouring nodes in the order we visited them (the queue helps us keep a track of this order) and repeat the previous step: Taking one step in all possible directions and visiting every possible neighbouring node. Let's unpack this step for our example:
          </p>
          <div className='image-wrapper-2'><img className='image' src={fig3} /></div>
          <div className='queue'>
            Queue: 
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>2<br/>1</div>
            </div>
<div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>3<br/>1</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>5<br/>2</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>6<br/>2</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>2<br/>2</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>3<br/>2</div>
            </div>
          </div>
          <p>Here, I decided to visit all the neighbours of the first node in the queue (node 1), so I first pop it off the queue. Then, I visit the neighbours (2, 3, 5, and 6) and add each neighbour to the queue. Note that the "Cost" value in each node in the queue is effectively the shortest number of hops needed to reach that node. This means that if we find a node in this queue whose neighbour is node 20, then we just add one to the "Cost" value of the node and end the algorithm.
          </p>
          <p> Also note that 0 is technically a neighbour of 1, but we decide not to visit it as we had passed through it once. More generally, we want to avoid getting stuck in a cyclic graph. For instance, the nodes 1, 2, 3, and 4 in the following graph form a cycle.
          </p>
          <div className='image-wrapper-2'><img className='image' src={fig0} /></div>
          <p>To detect and avoid cycles, for each node in our queue, we'll need to store a list of paths that we travelled so that we'll know which nodes to to skip visiting in the future. For simplicity, I won't be including this list in in pictures, but we will be storing them in the queue when we code the algorithm.
          </p>
          <p>Back to our example: recall that the "Cost" value in each node in the queue gives us the shortest path to that node. This means that we only need to keep popping nodes off the stack until we find a neighbouring node 20, at which point the we've found the shortest path. If we never find node 20 as a neighbour, then it means that no paths lead to node 20. Let's continue with our example by popping node 2 off the queue and visiting its neighbours.
          </p>
          <div className='image-wrapper-2'><img className='image' src={fig4} /></div>
          <div className='queue'>
            Queue: 
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>3<br/>1</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>5<br/>2</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>6<br/>2</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>2<br/>2</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>3<br/>2</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>6<br/>1</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>1<br/>1</div>
            </div>
          </div>
          <p>We haven't reached node 20 yet, and there are more nodes in the queue, so let's pop node 3 off the queue and visit its neighbours.
          </p>
          <div className='image-wrapper-2'><img src={fig5} /></div>
          <div className='queue'>
            Queue: 
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>5<br/>2</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>6<br/>2</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>2<br/>2</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>3<br/>2</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>6<br/>2</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>1<br/>2</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>1<br/>2</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>4<br/>2</div>
            </div>
          </div>
          <p>Finally, when we pop node 5 off the queue and, lo and behold, see that one of its neighbours is node 20, we are done. The shortest path to node 20, then, is 0 -> 1 -> 5 -> 20 and the minimum number of hops required is, therefore, the minimum number of hops required to reach node 5 plus one (<Latex>$2 + 1 = 3$</Latex>).
          </p>
          <div className='image-wrapper-2'><img src={fig6} /></div>
          <p><b>Attempt 2: Solving the actual maze. </b>Now that we know how to solve a maze where the distance between each pair of nodes is the same, let's look at how to solve the original problem, where there is a cost associated with each edge. Here's a very minimal example of a weighted graph, where each edge is labelled with its cost and where the shortest path highlighted in red. Notice that the shortest path here does not necessarily hop through the least number of nodes.
          </p>
          <div className='image-wrapper-2'><img src={bfs1} /></div>
          <p>Let's start just as we did before: Start at node 0 and visit its neighbours, nodes 1 and 4, and put them in the queue. The only difference is that we now need to do a sorted insert into the queue, ordered by the travelled distance or cost.
          </p>
          <div className='image-wrapper-2'><img src={bfs2} /></div>
          <div className='queue'>
            Queue: 
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>1<br/>1</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>4<br/>4</div>
            </div>
          </div>
          <p>Next, let's pop node 1 off the queue and visit its neighbour, node 2. Notice that we insert node 2 before node 4 in the queue as the distance travelled till node 2 is lesser.
          </p>
          <div className='image-wrapper-2'><img src={bfs3} /></div>
          <div className='queue'>
            Queue: 
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>2<br/>2</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>4<br/>4</div>
            </div>
          </div>
          <p>Next, let's pop node 2 off the queue and visit its neighbour, node 3. Node 3 is then added to the queue after node 4 as the distance travelled till it (5) is greater.
          </p>
          <div className='image-wrapper-2'><img src={bfs4} /></div>
          <div className='queue'>
            Queue: 
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>4<br/>4</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>3<br/>5</div>
            </div>
          </div>
          <p>Now, we pop node 4 off the queue and visit its neighbour, node 5. Although we have reached the end, <b>it's important that we do not terminate here!</b> Let's push node 5 on the queue and continue.
          </p>
          <div className='image-wrapper-2'><img src={bfs5} /></div>
          <div className='queue'>
            Queue: 
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>3<br/>5</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>5<br/>9</div>
            </div>
          </div>
          <p>Finally, we pop node 3 off the queue and visit its neighbour, node 5. When we now push node 5 on the queue it will be inserted before the previous node 5 that we inserted, by virtue of its lower cost. When we pop node 5 off the queue the next iteration, we will have found the shortest path (6).
          </p>
          <div className='image-wrapper-2'><img src={bfs1} /></div>
          <div className='queue'>
            Queue: 
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>5<br/>6</div>
            </div>
            <div className='queue-el'>
              <div>Node:<br/>Cost:</div>
              <div className='queue-el-1'>5<br/>9</div>
            </div>
          </div>
          <p>In summary, the only change we had to make is to do a sorted insert. You could do this in many ways: using a linked list, a priority queue, or using a dictionary. Here's some code that does this using a dictionary (You can find some test cases to practice <a href="https://raw.githubusercontent.com/gov-ind/ctf_solves/main/2022/tjctf/cheapest_cookies_2/tests">here</a>):
          </p>
          <Code>{sol2}</Code>
          <p><b>Conclusion. </b>As it turns out, there's a very elegant algorithm to find the shortest path between two nodes in a weighted graph due to Dijkstra. Dijkstra - a well-known advocate of simplicity - came up with his algorithm  without pen or paper in about twenty minutes. In his own words: <b>"One of the reasons that it is so nice was that I designed it without pencil and paper. I learned later that one of the advantages of designing without pencil and paper is that you are almost forced to avoid all avoidable complexities."</b>
          </p>
          <p>Perhaps it is a lesson to someone like me, who spent 4 hours and hundreds of lines of failed code, that sometimes, simpler solutions are better.
          </p>
        <div>&nbsp;</div>
      </div>
    );
  }
};
