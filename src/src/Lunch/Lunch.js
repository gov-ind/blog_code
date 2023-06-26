import React, { Component } from 'react';
import Latex from 'react-latex';
import MathJax from 'react-mathjax2'
import Code from '../CodeBlock';
import ReactMarkdown from 'react-markdown';
import Title from '../Title';
import fig1 from './fig1.png';
import fig2 from './fig2.png';
import fig3 from './fig3.png';
import fig4 from './fig4.png';
import fig5 from './fig5.png';
import fig6 from './fig6.png';
import fig7 from './fig7.png';
import fig8 from './fig8.png';
import fig9 from './fig9.png';
import fig10 from './fig10.png';
import fig11 from './fig11.png';

const chall = `from pwn import remote
from time import time
from random import sample
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

debug = False

def fit(box, dims, dir='h', offset=(0, 0)):
    fits = []
    box_l, box_w = box

    for dim in dims:
        if dir == 'h':
            idx = 0
        else:
            idx = 1

        fitted = 0
        results = []
        offset_ = offset # Copy of offset for each candidate

        multiplier = box[idx] // dim[idx]

        # Cut is longer (resp. wider) than box
        if multiplier == 0:
            continue

        # Cut is wider (resp. longer) than box
        if dim[idx ^ 1] > box[idx ^ 1]:
            continue

        remainder = box[idx] % dim[idx]
        candidates = []

        # Try optimize remainder
        if remainder != 0:
            for i in range(1, multiplier + 1):
                elements = [(i, dim)]
                aggregate = i * dim[idx]

                sorted_dims = sorted(dims, key=lambda a: a[idx], reverse=True)
                
                for inner_dim in sorted_dims:
                    # Ignore self
                    if inner_dim == dim:
                        continue
                    # Cut too wide (resp. long)
                    if inner_dim[idx ^ 1] > box[idx ^ 1]:
                        continue

                    remaining_dimension = box[idx] - aggregate
                        
                    # If this new cut can be fit into the remaining area
                    if inner_dim[idx] <= remaining_dimension:
                        # Calculate how many of these cuts we can fit in here
                        element_multiplier = remaining_dimension // inner_dim[idx]
                        aggregate += element_multiplier * inner_dim[idx]
                          
                        elements.append((element_multiplier, inner_dim))

                new_remainder = box[idx] % aggregate

                if new_remainder <= remainder:
                    remainder = new_remainder
                    # cands.append(arr)
                    candidates = elements

        else:
            candidates = [(multiplier, dim)]

        for candidate in candidates:
            element_multiplier = candidate[0]
            candidate_l, candidate_h = candidate[1]

            for a in range(element_multiplier):
                if dir == 'h':
                    results.append(((offset_[0] + a * candidate_l, offset_[1]),
                                    candidate[1]))
                else:
                    results.append(((offset_[0], offset_[1] + a * candidate_h),
                                    candidate[1]))

            fitted += candidate_l * candidate_h * element_multiplier
                
            if dir == 'h':
                new_box = (candidate_l * element_multiplier,
                           box_w - candidate_h)
            else:
                new_box = (box_l - candidate_l,
                           candidate_h * element_multiplier)
            
            # Check if inner box is not empty 
            if new_box[idx ^ 1] != 0:
                # If it isn't, start filling in other direction
                if dir == 'h':
                    new_results, new_fitted = fit(
                        new_box,
                        dims,
                        dir='v',
                        offset=(offset_[0], offset_[1] + candidate_h)
                )
                else:
                    new_results, new_fitted = fit(
                        new_box,
                        dims,
                        dir='h',
                        offset=(offset_[0] + candidate_l, offset_[1])
                    )

                fitted += new_fitted
                results += new_results

            # Adjust offsets for plotting
            if dir == 'h':
                offset_ = (offset_[0] + candidate_l * element_multiplier,
                           offset_[1])
            else:
                offset_ = (offset_[0],
                           offset_[1] + candidate_h * element_multiplier)

        fits.append((fitted, results))
       
    # Edge case
    if len(fits) == 0:
        return [], 0

    sorted_fits = sorted(fits, key=lambda a: a[0], reverse=True)

    return sorted_fits[0][1], sorted_fits[0][0]

def plot(data, rect, name='fig'):
    fig, ax = plt.subplots()

    ax.plot([1, 1],[1, 1],color='cyan')
    ax.add_patch(Rectangle((0, 0), rect[0], rect[1], color='#CECECE'))

    for x in data[0]:
        ax.add_patch(Rectangle(x[0], x[1][0], x[1][1],
                     facecolor='blue', edgecolor='black'))

    plt.savefig(name + '.png')

test_data = [
  ((70, 50),
  [(40, 7), (9, 20), (54, 49), (24, 37), (65, 22)]),
  ((200, 200),
  [(71, 17), (86, 88), (22, 86), (3, 63), (50, 40)]),
  ((70, 50),
  [(66, 12), (41, 17), (16, 22), (12, 17), (16, 18)]),
  ((100, 100),
  [(93, 28), (20, 7), (6, 9), (44, 74), (4, 74)]),
  ((100, 100),
  [(6, 63), (98, 40), (69, 89), (69, 9)]),
  ((21, 11),
  [(5, 9), (4, 4), (14, 2), (3, 2)]),
  ((4, 10),
  [(2, 6), (3, 6), (2, 2)]),
  ((70, 50),
  [(20, 38), (56, 12), (29, 33), (54, 28), (32, 34)]),
  ((21, 11),
  [(5, 7), (6, 11), (13, 8), (2, 8)]),
  ((21, 11),
  [(15, 3), (3, 7), (2, 5), (10, 3)])
]

if debug:
    for i, ((l, w), dims) in enumerate(test_data):
        fitted_h = fit((l, w), list(dims))
        fitted_v = fit((l, w), list(dims), dir='v')

        plot(fitted_h, (l, w), name=f'test_data_h_{i}')
        plot(fitted_v, (l, w), name=f'test_data_v_{i}')

while True:
    p1 = remote('lunch-with-the-cia.hsc.tf', 1337)

    for _ in range(3): print(p1.recvline())

    try:
        for i in range(10):
            print(p1.recvline())
       
            l, w, k = map(int, p1.recvline().strip().split())

            dims = []

            for _ in range(k):
                a, b = map(int, p1.recvline().strip().split())
                dims.append((a, b))

            if debug:
                print(f'l: {l} w: {w} k: {k}')
                print(dims)

            fits = [
                fit((l, w), dims)[1],
                fit((l, w), dims, dir='v')[1]
            ]

            start = time()

            for j in range(20):
                # Algorithm too slow
                if time() - start >= 10:
                    break
               
                # print(f'{j}')

                # Randomly remove one to five elements to improve chances
                for k in range(1, 5):
                    dims2 = sample(dims, max(len(dims) - i, 1))
                    fits.append(fit((l, w), dims2)[1])
                    fits.append(fit((l, w), dims2, dir='v')[1])
                
            waste = l * w - max(fits)

            print(f'Round: {i}... Waste {waste}')

            p1.sendline(str(waste))
            print(p1.recvline())

        print(p1.recvline())
        break
    except:
        # EOF
        pass`

//const m1 = '$S^d \\equiv m^{ed} \\equiv m^{k\\phi + 1} \\equiv m^{k\\phi}m \\equiv m \\pmod n$'

//const m1 = '$k = \\floor{\\frac{L}{l}}$'
//const m1 = '$2^{-40}$';

const m1 = '$5i + 7 \\equiv 0 \\pmod {17}$';

class THC extends Component {
  render() {
    return (
      
        <div className='content'>
          <Title title={this.props.title} date={this.props.date} cat={this.props.cat} />
          <div><b>Description. </b>This challenge was a variation of the classic bin-packing problem: Given one big <Latex>$L$ x $W$ rectangle and $k$</Latex> smaller rectangles, our task is to cut the big rectangle into portions, such that each portion's dimension is equal to one of the <Latex>$k$</Latex> smaller rectangle's dimensions, and return the minimum wasted space. Note that each of the <Latex>$k$</Latex> smaller rectangles may be used more than once, or not even once. Here's an example from the challenge description.
              <div className='space'><b>Sample Input:</b>
              <br />5 5 3 <br/>
              4 2 <br/>
              3 1 <br/>
              4 1 <br/>
              </div>
              <div className='space'><b>Sample Output:</b>
              <br />5</div>
              <div className='space'><b>Explanation. </b>
              We’re given a 5x5 grid, with three different bar types of dimensions 4x2, 3x1, and 4x1. One possible optimal way to pack these bars into the grid is shown below, with each color representing a different bar.   
              </div>
              <div className='image-wrapper'><img src={fig1} /></div>
              <p>
              In the above figure, 4x1 bars are red (and I've used three of them), the 4x2 bar is blue (and I've used a single one), and white squares are wasted (because I don't have space to fit the 3x1 bar). Note that the bars cannot be rotated, else we could have fit the 4x1 bar into the remaining column after rotating. Also note that bars can be used multiple times, as in the case of the 4x2 bar. Finally, some bars, such as the 3x1 bars, may also be unused. Thus, 5 squares are wasted at minimum, and this is the optimal solution for this configuration.
              </p>
          </div>
          <div className='space'><b>Disclaimer. </b>I misunderstood the problem description, so my solution - while it works - is not the intended one. What I totally missed is that all cuts need to go all the way through, making this a cutting problem (and not a bin packing problem as I initially thought) that can be solved by dynamic programming. Nevertheless, the heuristic I describe gives the optimal solution about 80% to 90% of the time, and with ten rounds, it is <i>just</i> about good enough to get the flag (the chances of failure are about 10%).
          </div>
          <div className='space'><b>Analysis. </b>There are <a href='https://www.aaai.org/Papers/ICAPS/2003/ICAPS03-029.pdf'>many</a> <a href='http://pds25.egloos.com/pds/201504/21/98/RectangleBinPack.pdf'>papers</a> <a href='https://www.codeproject.com/Articles/210979/Fast-optimizing-rectangle-packing-algorithm-for-bu'>describing</a> bin / rectangle packing algorithms, so you can have a look at those for an overview. However, because in this challenge we have the choice of packing each rectangle more than once (or never), I wrote a quick and dirty recursive function loosely based on <a href='https://en.wikipedia.org/wiki/Rectangle_packing#Packing_identical_squares_in_a_rectilinear_polygon'>this</a>.
          </div>
          <div className='space'>The function as such is pretty simple. It takes as input the big rectangle's dimensions <Latex>$L$ and $W$, and $k$ smaller rectangles</Latex>, and tries to pack a combination of one or more of these small rectangles such that the <b>either the wasted length or height is minimized</b>. For example, given <Latex>$L = 17$ and $W = 7$, and four rectangles $(5, 7), (3, 11), (7, 3)$, and $(11, 5)$, one naive approach is to just pack three $(5, 7)$</Latex> rectangles horizontally like this and minimize wasted length.
          </div>
          <div className='image-wrapper'><img src={fig2} /></div>
          <div className='space'>
            If we were allowed to choose only one rectangle, then this is optimal because the wasted space is 2 (<Latex>$17 \equiv 2 \pmod 5$</Latex>). In fact, because 17 is prime, we'll never find a number <Latex>$n$ such that $17 \equiv 0 \pmod n$</Latex>. However, we can find a combination of numbers that add up to 17. For instance, 5 + 5 + 7 will do, and so will 7 + 7 + 3. So we can optimize this function by fixing a <Latex>$k$ for each small rectangle of length $l$</Latex> such that <Latex>k = L // l</Latex>, looping from <Latex>$1$ to $k$, and checking if any other rectangle divides the remainder. In our case, $k = 17 // 5 = 3$, and for $i = 2$, we find that </Latex> <Latex>{m1}</Latex>. In pictures, we have:
          </div>
          <div className='image-wrapper'><img src={fig3} /></div>
          <div className='space'>
            Because this is the edge case, the function is done and returns the packed items. But wasn't it so convenient that it received a <Latex>$W = 5$</Latex> equal to one of the smaller rectangle's <Latex>$W$</Latex>? To see how this happened, let's consider how we'll invoke the recursive function such that it receives a convenient <Latex>$W$</Latex>. Consider <Latex>$L = 17, W = 21$</Latex>: We pick the first rectangle (5, 7), place it in the bottom-left corner, and decide to partition either vertically or horizontally. For a start, let's partition horizontally like this (the grey area is the newly partitioned rectangle).
          </div>
          <div className='image-wrapper'><img src={fig4} /></div>
          <div className='space'>
            We now have the <Latex>$L = 17, W = 7$</Latex> that we want to call the function with, and once we do so, it returns the combination (which we first tested it with).
          </div>
          <div className='image-wrapper'><img src={fig5} /></div>
          <div className='space'>
            We now look to optimize wasted space in the other direction (vertically), so we partition vertically. Depending on how the rectangles are grouped, we'd have a different number of partitions. In this example, we have two partitions like this.
          </div>
          <div className='image-wrapper'><img src={fig6} /></div>
          <div className='space'>
            We call the function and ask it to pack into each of these grey rectangles, only this optimizing wasted space vertically. You'll notice that this time, the function will have a convenient <Latex>$L$</Latex> for each of the grey rectangles, so we expect it to do a fairly decent job.
          </div>
          <div className='image-wrapper'><img src={fig7} /></div>
          <div className='space'>
            As it turns out, it packs one of these rectangles pretty well, but there's wasted horizontal space for the left grey rectangle. That's alright, because if we further partition this one into two more rectangles horizontally and ask the function to optimize it, it will happily do so.
          </div>
          <div className='image-wrapper'><img src={fig8} /></div>
          <div className='image-wrapper'><img src={fig9} /></div>
          <div className='space'>
            At this point, we're done because we have no more rectangles to fill (of course, we would also be done if there were more rectangles to be filled, but if all of them were smaller than every smaller rectangle). Also note that this whole process mentioned so for calculated possible combinations just for the first rectangle (5, 7). For each recursive call to the function we loop over each rectangle, but to prevent combinatorial explosion, the function only returns the one combination that minimizes wasted length (or height).
          </div>
          <div className='space'>And finally, because this is a heuristic, always optimizing the lengths and widths might not always be a good idea. Consider this case: Here the red rectangle is a perfect fit horizontally but its height prevents more rectangles from being packed on top of it.
          </div>
          <div className='image-wrapper'><img src={fig10} /></div>
          <div className='space'>
            There are ways to optimize this, but I found that a quick fix is to run the rectangle packing algorithm a bunch of times, each time removing one rectangle randomly. For example, running the previous example without the (3, 7) rectangle gives us the optimal solution.
          </div>
          <div className='image-wrapper'><img src={fig11} /></div>
          <div className='space'>
            To maximize my chances of getting the best result, for each round, I randomly removed upto 4 items and ran my algorithm and chose the highest count. To clear all ten rounds, I scripted it till I got lucky (usually happens in about 5 minute or so). Also, if you start packing vertically (we started horizontally), you might get better results, so you might want to try that as well. Here's the full script.
          </div>
          <Code>
            {chall}
          </Code>
          <div>&nbsp;</div>
        </div>
    );
  }
}

export default THC;

