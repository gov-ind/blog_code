import React, { Component } from 'react';
import Latex from 'react-latex';
import MathJax from 'react-mathjax2'
import Code from '../CodeBlock';
import ReactMarkdown from 'react-markdown';
import Title from '../Title';

const chall = `import re

parts = [
	("0A$", "1-0B"),
	("0A(.)-", "1-\\1B"),
	("^0B", "0C1-"),
	("(.)-0B", "\\1C1-"),
	("^0C", "0A1-"),
	("(.)-0C", "\\1A1-"),
	("1A$", "1-0H"),
	("1A(.)-", "1-\\1H"),
	("1B$", "2-0B"),
	("1B(.)-", "2-\\1B"),
	("1C$", "2-0C"),
	("1C(.)-", "2-\\1C"),
	("^2A", "0C2-"),
	("(.)-2A", "\\1C2-"),
	("^2B", "0B1-"),
	("(.)-2B", "\\1B1-"),
	("^2C", "0A2-"),
	("(.)-2C", "\\1A2-")
]

s = '0A'

n = 0
while True:
	for a, b in parts:
		s, c = re.subn(a, b, s)
		if c:
			n += c
			break
	else:
		break

print(f"SECFEST{{{n}}}")`;

const code1 = `while True:
	if n > 1000: break
	for a, b in parts:
		s, c = re.subn(a, b, s)
		if c:
			print(f'Step: {n} State: {s}')
			n += c
			break
	else:
		break`;

const out = `Step: 22 State: 1-2-2-2-2-2-2-0B
Step: 23 State: 1-2-2-2-2-2-2C1-
Step: 24 State: 1-2-2-2-2-2A2-1-
Step: 25 State: 1-2-2-2-2C2-2-1-
Step: 26 State: 1-2-2-2A2-2-2-1-
Step: 27 State: 1-2-2C2-2-2-2-1-
Step: 28 State: 1-2A2-2-2-2-2-1-
Step: 29 State: 1C2-2-2-2-2-2-1-
Step: 30 State: 2-2C2-2-2-2-2-1-
Step: 31 State: 2A2-2-2-2-2-2-1-
Step: 32 State: 0C2-2-2-2-2-2-2-1-
Step: 33 State: 0A1-2-2-2-2-2-2-2-1-
Step: 34 State: 1-1B2-2-2-2-2-2-2-1-
Step: 35 State: 1-2-2B2-2-2-2-2-2-1-
Step: 36 State: 1-2B1-2-2-2-2-2-2-1-
Step: 37 State: 1B1-1-2-2-2-2-2-2-1-
Step: 38 State: 2-1B1-2-2-2-2-2-2-1-
Step: 39 State: 2-2-1B2-2-2-2-2-2-1-
Step: 40 State: 2-2-2-2B2-2-2-2-2-1-
Step: 41 State: 2-2-2B1-2-2-2-2-2-1-
Step: 42 State: 2-2B1-1-2-2-2-2-2-1-
Step: 43 State: 2B1-1-1-2-2-2-2-2-1-
Step: 44 State: 0B1-1-1-1-2-2-2-2-2-1-
Step: 45 State: 0C1-1-1-1-1-2-2-2-2-2-1-
Step: 46 State: 0A1-1-1-1-1-1-2-2-2-2-2-1-
Step: 47 State: 1-1B1-1-1-1-1-2-2-2-2-2-1-
Step: 48 State: 1-2-1B1-1-1-1-2-2-2-2-2-1-
Step: 49 State: 1-2-2-1B1-1-1-2-2-2-2-2-1-
Step: 50 State: 1-2-2-2-1B1-1-2-2-2-2-2-1-
Step: 51 State: 1-2-2-2-2-1B1-2-2-2-2-2-1-
Step: 52 State: 1-2-2-2-2-2-1B2-2-2-2-2-1-
Step: 53 State: 1-2-2-2-2-2-2-2B2-2-2-2-1-
Step: 54 State: 1-2-2-2-2-2-2B1-2-2-2-2-1-
Step: 55 State: 1-2-2-2-2-2B1-1-2-2-2-2-1-
Step: 56 State: 1-2-2-2-2B1-1-1-2-2-2-2-1-
Step: 57 State: 1-2-2-2B1-1-1-1-2-2-2-2-1-
Step: 58 State: 1-2-2B1-1-1-1-1-2-2-2-2-1-
Step: 59 State: 1-2B1-1-1-1-1-1-2-2-2-2-1-
Step: 60 State: 1B1-1-1-1-1-1-1-2-2-2-2-1-
Step: 61 State: 2-1B1-1-1-1-1-1-2-2-2-2-1-
Step: 62 State: 2-2-1B1-1-1-1-1-2-2-2-2-1-
Step: 63 State: 2-2-2-1B1-1-1-1-2-2-2-2-1-
Step: 64 State: 2-2-2-2-1B1-1-1-2-2-2-2-1-
Step: 65 State: 2-2-2-2-2-1B1-1-2-2-2-2-1-
Step: 66 State: 2-2-2-2-2-2-1B1-2-2-2-2-1-
Step: 67 State: 2-2-2-2-2-2-2-1B2-2-2-2-1-
Step: 68 State: 2-2-2-2-2-2-2-2-2B2-2-2-1-
Step: 69 State: 2-2-2-2-2-2-2-2B1-2-2-2-1-
Step: 70 State: 2-2-2-2-2-2-2B1-1-2-2-2-1-
Step: 71 State: 2-2-2-2-2-2B1-1-1-2-2-2-1-
Step: 72 State: 2-2-2-2-2B1-1-1-1-2-2-2-1-
Step: 73 State: 2-2-2-2B1-1-1-1-1-2-2-2-1-
Step: 74 State: 2-2-2B1-1-1-1-1-1-2-2-2-1-
Step: 75 State: 2-2B1-1-1-1-1-1-1-2-2-2-1-
Step: 76 State: 2B1-1-1-1-1-1-1-1-2-2-2-1-
Step: 77 State: 0B1-1-1-1-1-1-1-1-1-2-2-2-1-
Step: 78 State: 0C1-1-1-1-1-1-1-1-1-1-2-2-2-1-
Step: 79 State: 0A1-1-1-1-1-1-1-1-1-1-1-2-2-2-1-`;

const out2 = `Step: 22 State: 1-2-2-2-2-2-2-0B
Step: 23 State: 1-2-2-2-2-2-2C1-
Step: 24 State: 1-2-2-2-2-2A2-1-
Step: 25 State: 1-2-2-2-2C2-2-1-
Step: 26 State: 1-2-2-2A2-2-2-1-
Step: 27 State: 1-2-2C2-2-2-2-1-
Step: 28 State: 1-2A2-2-2-2-2-1-
Step: 29 State: 1C2-2-2-2-2-2-1-`;

const out3 = `Step: 29 State: 1C2-2-2-2-2-2-1-
Step: 30 State: 2-2C2-2-2-2-2-1-
Step: 31 State: 2A2-2-2-2-2-2-1-
Step: 32 State: 0C2-2-2-2-2-2-2-1-
Step: 33 State: 0A1-2-2-2-2-2-2-2-1-`;

const out4 = `Step: 33 State: 0A1-2-2-2-2-2-2-2-1-
Step: 34 State: 1-1B2-2-2-2-2-2-2-1-
Step: 35 State: 1-2-2B2-2-2-2-2-2-1-
Step: 36 State: 1-2B1-2-2-2-2-2-2-1-
Step: 37 State: 1B1-1-2-2-2-2-2-2-1-
Step: 38 State: 2-1B1-2-2-2-2-2-2-1-
Step: 39 State: 2-2-1B2-2-2-2-2-2-1-
Step: 40 State: 2-2-2-2B2-2-2-2-2-1-
Step: 41 State: 2-2-2B1-2-2-2-2-2-1-
Step: 42 State: 2-2B1-1-2-2-2-2-2-1-
Step: 43 State: 2B1-1-1-2-2-2-2-2-1-
Step: 44 State: 0B1-1-1-1-2-2-2-2-2-1-
Step: 45 State: 0C1-1-1-1-1-2-2-2-2-2-1-
Step: 46 State: 0A1-1-1-1-1-1-2-2-2-2-2-1-`;

const out5 = `Step: 46 State: 0A1-1-1-1-1-1-2-2-2-2-2-1-
Step: 47 State: 1-1B1-1-1-1-1-2-2-2-2-2-1-
Step: 48 State: 1-2-1B1-1-1-1-2-2-2-2-2-1-
Step: 49 State: 1-2-2-1B1-1-1-2-2-2-2-2-1-
Step: 50 State: 1-2-2-2-1B1-1-2-2-2-2-2-1-
Step: 51 State: 1-2-2-2-2-1B1-2-2-2-2-2-1-
Step: 52 State: 1-2-2-2-2-2-1B2-2-2-2-2-1-
Step: 53 State: 1-2-2-2-2-2-2-2B2-2-2-2-1-
Step: 54 State: 1-2-2-2-2-2-2B1-2-2-2-2-1-
Step: 55 State: 1-2-2-2-2-2B1-1-2-2-2-2-1-
Step: 56 State: 1-2-2-2-2B1-1-1-2-2-2-2-1-
Step: 57 State: 1-2-2-2B1-1-1-1-2-2-2-2-1-
Step: 58 State: 1-2-2B1-1-1-1-1-2-2-2-2-1-
Step: 59 State: 1-2B1-1-1-1-1-1-2-2-2-2-1-
Step: 60 State: 1B1-1-1-1-1-1-1-2-2-2-2-1-
Step: 61 State: 2-1B1-1-1-1-1-1-2-2-2-2-1-
Step: 62 State: 2-2-1B1-1-1-1-1-2-2-2-2-1-
Step: 63 State: 2-2-2-1B1-1-1-1-2-2-2-2-1-
Step: 64 State: 2-2-2-2-1B1-1-1-2-2-2-2-1-
Step: 65 State: 2-2-2-2-2-1B1-1-2-2-2-2-1-
Step: 66 State: 2-2-2-2-2-2-1B1-2-2-2-2-1-
Step: 67 State: 2-2-2-2-2-2-2-1B2-2-2-2-1-
Step: 68 State: 2-2-2-2-2-2-2-2-2B2-2-2-1-
Step: 69 State: 2-2-2-2-2-2-2-2B1-2-2-2-1-
Step: 70 State: 2-2-2-2-2-2-2B1-1-2-2-2-1-
Step: 71 State: 2-2-2-2-2-2B1-1-1-2-2-2-1-
Step: 72 State: 2-2-2-2-2B1-1-1-1-2-2-2-1-
Step: 73 State: 2-2-2-2B1-1-1-1-1-2-2-2-1-
Step: 74 State: 2-2-2B1-1-1-1-1-1-2-2-2-1-
Step: 75 State: 2-2B1-1-1-1-1-1-1-2-2-2-1-
Step: 76 State: 2B1-1-1-1-1-1-1-1-2-2-2-1-
Step: 77 State: 0B1-1-1-1-1-1-1-1-1-2-2-2-1-
Step: 78 State: 0C1-1-1-1-1-1-1-1-1-1-2-2-2-1-
Step: 79 State: 0A1-1-1-1-1-1-1-1-1-1-1-2-2-2-1-`;

const out6 = `Step: 166 State: 1B1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-
Step: 167 State: 2-1B1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-
Step: 168 State: 2-2-1B1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-
Step: 169 State: 2-2-2-1B1-1-1-1-1-1-1-1-1-1-1-1-1-1-1-
Step: 170 State: 2-2-2-2-1B1-1-1-1-1-1-1-1-1-1-1-1-1-1-
Step: 171 State: 2-2-2-2-2-1B1-1-1-1-1-1-1-1-1-1-1-1-1-
Step: 172 State: 2-2-2-2-2-2-1B1-1-1-1-1-1-1-1-1-1-1-1-
Step: 173 State: 2-2-2-2-2-2-2-1B1-1-1-1-1-1-1-1-1-1-1-
Step: 174 State: 2-2-2-2-2-2-2-2-1B1-1-1-1-1-1-1-1-1-1-
Step: 175 State: 2-2-2-2-2-2-2-2-2-1B1-1-1-1-1-1-1-1-1-
Step: 176 State: 2-2-2-2-2-2-2-2-2-2-1B1-1-1-1-1-1-1-1-
Step: 177 State: 2-2-2-2-2-2-2-2-2-2-2-1B1-1-1-1-1-1-1-
Step: 178 State: 2-2-2-2-2-2-2-2-2-2-2-2-1B1-1-1-1-1-1-
Step: 179 State: 2-2-2-2-2-2-2-2-2-2-2-2-2-1B1-1-1-1-1-
Step: 180 State: 2-2-2-2-2-2-2-2-2-2-2-2-2-2-1B1-1-1-1-
Step: 181 State: 2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-1B1-1-1-
Step: 182 State: 2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-1B1-1-
Step: 183 State: 2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-1B1-
Step: 184 State: 2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-1B
Step: 185 State: 2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-2-0B`;

const code2 = `# Loop till just before hitting the length of the state
while counter < ln - 1:
    # Increase the number of cells
    ln += 3
  
    # Take two steps forward, two steps back
    step += counter * 2 + (counter + 1) * 2
       
    # Take three steps forward (as the number of cells was increased by 3)
    steps += 3
        
    # The next step forwards must be 2 + number of new cells added
    counter += 5`;

const code3 = `# Move two sub loops and take ln steps if odd or
    # just take just ln step loop if even
    if is_odd:     
        step += counter * 2 + ln
    else:
        step += ln`;

const solve = `def iterate(state, step):
    ln = state.count('-') # The length of the state (1 - number of cells)
    first_element = state[0] # The first element
    is_odd_number_of_steps = ln % 2 == 1 # Is the number of steps odd?

    # Move ln steps to the first cell
    step += ln

    # Increase the state length, take forward steps, and prepare the
    # loop counter an appropriate number of times depending on
    # the state length and the first element
    if first_element == '1':
        if is_odd_number_of_steps:
            ln += 2
            step += 4
            counter = 2
        else:
            # Halting case
            print(f'SECFEST{{{step +2}}}')
            exit()
    else:
        ln += 1
        step += 1
        counter = 1

        if not is_odd_number_of_steps:
            ln += 1
            step += 1
            counter += 1

    # Loop till just before hitting the length of the state
    while counter < ln - 1:
        # Increase the number of cells
        ln += 3
        # Take two steps forward, two steps back
        step += counter * 2 + (counter + 1) * 2
        # Take three steps forward (as the number of cells was increased by 3)
        step += 3
        # The next step forwards must be 2 + number of new cells added
        counter += 5

    # Increase the state length one last time
    ln += 1

    # Move two sub loops and take ln steps if odd or
    # just take just ln step loop if even
    if is_odd_number_of_steps:     
        step += counter * 2 + ln
    else:
        step += ln

    # Flip the first element, if required
    if (is_odd_number_of_steps and first_element == '1' or not
        is_odd_number_of_steps and first_element != '1'):
        next_state = '2-' if first_element == '1' else '1-'
    else:
        next_state = first_element + '-'

    next_state += '-'.join(['2' for _ in range(ln - 1)]) + '-0B'

    return next_state, step

state = '1-2-2-2-2-2-2-0B'
step = 22

while True:
    state, step = iterate(state, step)`;

class PickledOnions extends Component {
  render() {
    return (      
        <div className='content'>
          <Title title={this.props.title} date={this.props.date} cat={this.props.cat} />
          <div><b>Description. </b>I played Security Fest's CTF this Thursday after work, and I managed to solve just this challenge after many gruelling hours. This was also the first time I ever got first blood on a challenge, so I'm really happy and had to do a writeup. Here is the source code for the challenge:
          </div>
          <Code>{chall}</Code>
          <p>
          <b>Analysis. </b>At first glance, it looks like some sort of state machine that takes in the input <span className='code-block'>s</span> and keeps changing it according to a set of rules defined by the regular expressions in <span className='code-block'>parts</span>. If a particular rule matches <span className='code-block'>s</span>, a counter <span className='code-block'>n</span> is incremented. The program stops when none of the rules in <span className='code-block'>parts</span> matches <span className='code-block'>s</span>, with the last line of the program printing the value of the counter <span className='code-block'>n</span> (the flag). 
          </p>
          <p>Simply running this program will take way too much time, so let's break out of the <span className='code-block'>while</span> loop after the counter crosses, say, 1000. Let's also inspect the state <span className='code-block'>s</span> each time a rule matches to better understand the rule actually does by adding a <span className='code-block'>print</span> statement right after a rule matches. Here's what the <span className='code-block'>while</span> loop looks like after these changes:
          </p>
          <Code>{code1}</Code>
          <p>Here's a portion of the output starting at step <span className='code-block'>22</span>:</p>
          <pre className='box'>{out}</pre>
          <p>Let's start at step <span className='code-block'>22</span>: It consists of a sequence of either <span className='code-block'>0</span>, <span className='code-block'>1</span>, or <span className='code-block'>2</span> joined by a hyphen, with the letter <span className='code-block'>B</span> at the end. If we consider each hyphen to be a cell, and the number adjacent to it to be the state of the cell, then this sequence of state can be thought of as a Turing machine, with the letter <span className='code-block'>B</span> currently positioned at the last cell.
          </p>
          <p>If you scroll through steps <span className='code-block'>22</span> to <span className='code-block'>185</span>, you'll realize that the rules basically move this letter through these cells in a certain pattern before bringing it back to the last cell again (in step <span className='code-block'>185</span>). You'll also notice that at each time step, the letter is only moved by one cell to the left or right, making the program inefficient. If we can somehow optimize what the rules do, then we can actually bring the program to a halt and print the flag.
          </p>
          <p>First, lets look at steps <span className='code-block'>23</span> to <span className='code-block'>29</span>. In step <span className='code-block'>23</span>, the <span className='code-block'>B</span> in the last cell is moved to the second-to-last cell and also changed into a <span className='code-block'>C</span>. Steps <span className='code-block'>24</span> to <span className='code-block'>29</span> do something similar - moving the letter back by one cell and alternating its value between <span className='code-block'>C</span> and <span className='code-block'>A</span>. This means that by the time the letter reaches the first cell, it is either a <span className='code-block'>C</span> or an <span className='code-block'>A</span> depending on the number of cells (<span className='code-block'>C</span> if the number of cells is even, and <span className='code-block'>A</span> if it is odd). 
          </p>
          <pre className='box'>
          {out2}
          </pre>
          <p>Optimizing the above transition is simple: All we need is the number of cells and whether this number is even or odd, and we can do one single addition to output the state at which the letter reaches the first cell.
          </p>
          <p>Before we continue, let's look a the big picture: We're trying to get the flag, for which we need the program to halt at some point. The only rules that will halt the program are <span className='code-block'>parts[6]</span> and <span className='code-block'>parts[7]</span>. The latter of these will happen only when the <span className='code-block'>A</span> is in the first cell and the number of the first cell is <span className='code-block'>1</span>. Moreover, as we saw previously, the first letter can only be <span className='code-block'>A</span> if the number of cells is odd. In summary, we will need to go through all the states until we reach one whose length is odd and one whose first letter is <span className='code-block'>1</span>.
          </p>
          <p>Now, coming back to step <span className='code-block'>30</span>: it moves <span className='code-block'>C</span> one cell forward, then step <span className='code-block'>31</span>  moves it back one cell and changes it to an <span className='code-block'>A</span>. Next, steps <span className='code-block'>32</span> and <span className='code-block'>33</span> add two cells to the state. Optimizing this is also straightforward: Add two the number of cells.
          </p>
          <pre className='box'>{out3}</pre>
          <p>Next, let's look at what happens between steps <span className='code-block'>33</span> and <span className='code-block'>46</span>: <span className='code-block'>A</span> is changed to a <span className='code-block'>B</span> and this <span className='code-block'>B</span> is bought two cells forward (step <span className='code-block'>35</span>), and then two cells back (step <span className='code-block'>37</span>). Then <span className='code-block'>B</span> is bought three cells forward (step <span className='code-block'>40</span>), and then three cells back (step <span className='code-block'>43</span>). So far, that's a total of <Latex>(2 + 3) x 2</Latex> steps. Finally, at step <span className='code-block'>43</span>, three cells are added to the state. In all, the number of steps is <Latex>(2 + 3) x 2 + 3 = 13</Latex>.
          </p>
          <pre className='box'>{out4}</pre>
          <p>Now, look at steps <span className='code-block'>46</span> to <span className='code-block'>79</span>: This cycle is similar to the one between steps <span className='code-block'>33</span> and <span className='code-block'>46</span>. Last cycle, we went forwards 2 and 3 times, so this time we expect to go forwards 4 and 5 times. However, recall that we added 3 new cells, so this time we go forwards 7 and 8 times. In all, we take <Latex>(7 + 8) x 2 + 3 = 33</Latex> steps.
          </p>
          <pre className='box'>{out5}</pre>
          <p>How long does this cycle repeat? As it turns out, it repeats till B reaches the last cell. We can optimize this cycle as follows:
          </p>
          <Code>{code2}</Code>
          <p>Finally, between steps <span className='code-block'>166</span> and <span className='code-block'>185</span>, <span className='code-block'>B</span> is finally bought back to the last cell. As it turns out, the number of loops to bring <span className='code-block'>B</span> to the last cells varies based on whether there are an even or odd number of cells.
          </p>
          <pre className='box'>{out6}</pre>
          <Code>{code3}</Code>
          <p>To summarize, between steps <span className='code-block'>22</span> and <span className='code-block'>185</span>, we have sent the letter <span className='code-block'>B</span> through a pattern of cells before bringing it back to the last cell. In the end, only two things have have changed: First, the number of cells have increased from 8 to 20, and second, the first number in the state has changed from 2 to 1. Recall that for our program to halt, we need to keep sending <span className='code-block'>B</span> around these cycles (using our optimized loops) till we reach a state where the number of cells is odd and the first number is 1.
          </p>
          <p>In practice, there are complications. For example, the number of steps taken forward and back depend on the first number. The first number itself depends on whether the number of cells is odd or even. It is difficult to explain these patterns, so I do not elaborate further. To debug these issues, what I had to do was manually compare my simulation with the actual program, and then go back and fix my simulation. Here's my solve script:
          </p>
          <Code>{solve}</Code>
          <div>&nbsp;</div>
        </div>
    );
  }
}

export default PickledOnions;

