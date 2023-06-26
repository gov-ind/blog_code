import React, { Component } from 'react';
import Latex from 'react-latex';
import MathJax from 'react-mathjax2'
import Code from '../CodeBlock';
import ReactMarkdown from 'react-markdown';

const code1 = `#!/usr/local/bin/python

from random import SystemRandom
rand = SystemRandom()


def test_substitution(substitutions, string):
    def substitute(s, a, b):
        initial = s
        s = s.replace(a, b)
        return (s, not s == initial)

    # s ^ 2 rounds for string of length s
    for _ in range(len(string) ** 2):
        performed_substitute = False
        for find, replace in substitutions:
            string, performed_substitute = substitute(string, find, replace)
            # once a substitute is performed, go to next round
            if performed_substitute:
                break
        # if no substitute was performed this round, we are done
        if not performed_substitute:
            break
    return string


def read_substitution(string):
    substitution = tuple(s.strip() for s in string.split('=>'))
    return substitution if len(substitution) == 2 else ('', '')


def run_level(case_generator, max_subs, test_cases=32):
    if input('See next level? (y/n) ') == 'n':
        exit()

    print('-' * 80)
    print('Here is this level\'s intended behavior:')
    for _ in range(10):
        initial, target = case_generator()
        print(f'\nInitial string: {initial}')
        print(f'Target string: {target}')

    print('-' * 80)
    substitutions = []
    current = input(
        f'Enter substitution of form "find => replace", {max_subs} max: '
    )
    substitutions.append(read_substitution(current))
    for _ in range(max_subs - 1):
        if input('Add another? (y/n) ') == 'n':
            break
        current = input('Enter substitution of form "find => replace": ')
        substitutions.append(read_substitution(current))

    print('-' * 80)
    print('Testing substitutions...', flush=True)
    for _ in range(test_cases):
        initial, target = case_generator()
        output = test_substitution(substitutions, initial)
        if not output == target:
            print(f'Failed on string: {initial}.')
            print(f'Expected: {target}.')
            print(f'Computed: {output}.')
            exit()
    print('Level passed!')


print('''
Welcome to The Substitution Game!

In each level, you will enter a list of string substitutions.
For example, you may want to change every instance of 'abcd' to 'def'.

The game will provide a series of test cases.
For each case, substitutions will be applied repeatedly in a series of rounds.
In each round, the first possible substitution will be performed.
For test case of length s, there will be s ^ 2 substitution rounds.

In each round, we will show examples of intended substitution behavior.
It is your goal to match our behavior.
''')


randint = rand.randint


def level_1():
    initial = f'{"0" * randint(0, 20)}initial{"0" * randint(0, 20)}'
    target = initial.replace('initial', 'target')
    return (initial, target)


def level_2():
    initial = ''.join(
        rand.choice(['hello', 'ginkoid']) for _ in range(randint(10, 20))
    )
    target = initial.replace('hello', 'goodbye').replace('ginkoid', 'ginky')
    return (initial, target)


def level_3():
    return ('a' * randint(10, 100), 'a')


def level_4():
    return ('g' * randint(10, 100), 'ginkoid')


def level_5():
    random_string = ''.join(
        str(randint(0, 1)) for _ in range(randint(25, 50))
    )
    initial = random_string
    initial += rand.choice(['', '0', '1'])
    initial += random_string[::-1]

    if rand.randint(0, 1):
        return (f'^{initial}$', 'palindrome')
    else:
        shuffled = list(initial)
        rand.shuffle(shuffled)
        return (
            f'^{"".join(shuffled)}$',
            'not_palindrome'
        )


def level_6():
    first_number = randint(0, 255)
    second_number = randint(0, 255)
    answer = first_number + second_number
    result = 'correct'
    # random chance that answer is wrong
    if rand.randint(0, 1):
        answer = randint(0, 511)
        if not answer == first_number + second_number:
            result = 'incorrect'

    # convert all to string representations
    numbers = [
        bin(first_number)[2:], bin(second_number)[2:], bin(answer)[2:]
    ]

    # chance to pad a number or answer
    if randint(0, 1):
        index = randint(0, 2)
        numbers[index] = '0' * randint(1, 3) + numbers[index]
        # chance to make padded number additionally wrong
        if randint(0, 1):
            result = 'incorrect'
            numbers[index] = '1' + numbers[index]

    return (f'^{numbers[0]}+{numbers[1]}={numbers[2]}$', result)


run_level(level_1, 5)
run_level(level_2, 10)
run_level(level_3, 10)
run_level(level_4, 10)
run_level(level_5, 100, test_cases=128)
run_level(level_6, 300, test_cases=128)

print('-' * 80)
print('You win! Here\'s your flag: [REDACTED]')`;

const code2 = `from pwn import remote, process

debug = True

if not debug:
    p1 = remote('mc.ax', 31996)
else:
    p1 = process(['python3.8', 'chall.py'])

def send_subs(subs):
    for _ in range(3):
        p1.recvline()

    p1.sendline('y')

    for _ in range(33):
        p1.recvline()
    
    if len(subs) > 1:
        for sub in subs[:-1]:
            p1.sendline(sub[0] + '=>' + sub[1])
            p1.sendline('y')

    p1.sendline(subs[-1][0] + '=>' + subs[-1][1])
    p1.sendline('n')

for _ in range(11):
    p1.recvline()

print('Level 1')
send_subs([('initial', 'target')])

print('Level 2')
send_subs([('ginkoid', 'ginky'), ('hello', 'goodbye')])

print('Level 3')
send_subs([('aa', 'a')])

print('Level 4')
send_subs([('ggg', 'gg'), ('gg', 'ginkoid')])

print('Level 5')
send_subs([
  # Edge cases
  ('1x', 'x'), ('0x', 'x'), ('^x', 'not_palindrome'),
  ('^$', 'palindrome'), ('^1$', 'palindrome'), ('^0$', 'palindrome'),

  # Checks
  ('1*1$', '$'), ('0*0$', '$'), ('1*0$', 'x'), ('0*1$', 'x'),

  # Walk
  ('1*1', '11*'), ('1*0', '01*'), ('0*1', '10*'), ('0*0', '00*'),

  # Setup
  ('^1', '^1*'), ('^0', '^0*')
])

print('Level 6')
send_subs([
  # Edge cases
  ('^0+0c=1$', 'correct'), ('^0+0nc=0$', 'correct'),
  ('ncx', 'x'), ('cx', 'x'), ('^x', 'x'), ('+x', 'x'),
  ('=x', 'x'), ('1x', 'x'), ('0x', 'x'), ('x', 'incorrect'),

  # Padding
  ('+c', '+0c'), ('+nc', '+0nc'), ('^+', '^0+'), ('=$', '=0$'),

  # Checks
  ('0*0$', '$'), ('1*1$', '$'), ('0*1$', 'x'), ('1*0$', 'x'),

  # Additions
  ('0*0nc=', 'nc=0*'), ('0*0c=', 'nc=1*'), ('0*1nc=', 'nc=1*'), ('0*1c=', 'c=0*'),
  ('1*0nc=', 'nc=1*'), ('1*0c=', 'c=0*'), ('1*1nc=', 'c=0*'), ('1*1c=', 'c=1*'),

  # Walk
  ('1*+', '+1*'), ('0*+', '+0*'), ('1*1', '11*'), ('1*0', '01*'),
  ('0*0', '00*'), ('0*1', '10*'),
  
  # Setup
  ('1=', '1nc='), ('0=', '0nc='), ('1+', '1*+'), ('0+', '0*+')
])

for _ in range(5):
    print(p1.recvline())`;

class PickledOnions extends Component {
  render() {
    return (
      
      <div className='main'>
        <div className='content'>
          <div><b>Description. </b>We're given a script that runs input passed to it through Python's <span className='code-block'>string.replace</span>. The challenge is to prove that this setup is Turing complete.
          </div>
          <Code>{code1}</Code>
          <div className='space'><b>Level 1.</b> It's easiest to see how this works by diving right in. In the first level, we're asked to change something like <span className='code-block'>0000000000initial00000000</span> to <span className='code-block'>0000000000target00000000</span>. Easy enough: A rule like <span className='code-block'>initial=>target</span> will do.
          </div>
          <div className='space'><b>Level 2.</b> Another easy level: Inputs strings like <span className='code-block'>helloginkoid</span> must become <span className='code-block'>goodbyeginky</span>, so this is basically just an extension of the previous level. The two rules <span className='code-block'>hello=>goodbye</span> and <span className='code-block'>ginkoid=>ginky</span> do the job.
          </div>
          <div className='space'><b>Level 3.</b> This time there's something new: Strings with the character <span className='code-block'>a</span> repeated an arbitrary number of times must become just the character <span className='code-block'>a</span>. The rule to do this (<span className='code-block'>aa=>a</span>) is suriprisingly simple and gives us some insight about how the <span className='code-block'>test_substitution</span> function works. This function applies the same rule each round, so each time it does so, the length of the input string halves. So for a string of length <Latex>n</Latex>, it only takes <Latex>$\log_2 n + 1$</Latex> rounds to reduce it to a single character. For example, this happens for an input like <span className='code-block'>aaaaaaaa</span>:
          </div>
          <div className='space box'>
            Round 1: &nbsp; aaaaaaaa<br/>
            Round 2: &nbsp; aaaa<br/>
            Round 3: &nbsp; aa<br/>
            Round 4: &nbsp; a<br/>
          </div>
          <div className='space'><b>Level 4.</b> Again very similar to level 3: Strings with the character <span className='code-block'>g</span> repeated an arbitrary number of times must become <span className='code-block'>ginkoid</span>. Using the same idea as we did in level 3, we can use the rule <span className='code-block'>ggg=>gg</span> to fold the input to <span className='code-block'>gg</span>. Then we can add a new rule <span className='code-block'>gg=>ginkoid</span> to turn the 2 <span className='code-block'>g</span>s to <span className='code-block'>ginkoid</span>.
          </div>
          <div className='space'><b>Level 5.</b> This is where things get challenging. In this level, palindromes must be detected and converted to the string <span className='code-block'>palindrome</span>, and all other strings must be converted to the string <span className='code-block'>not_palindrome</span>. Because <span className='code-block'>string.replace</span> only works with adjacent characters, it's not immediately obvious how to go about doing this. The most natural thing to do is to start detecting from the middle because (as I wrongly assumed) all palindromes reflect around the middle, and then verify that each character to the left and right of this middle section is the same. However, this approach does not work for many reasons. For starters, odd-length palindromes don't reflect around the middle, and detecting them requires more than the 100 substitution limit this level enforces.
          </div>
          <div className='space'>The only way, then, is to verify that characters on either end of the string are the same. But for this, we would need to somehow bring the first character to the end to do the comparison. So here's a trick to do just that: First, I'm going to need some "marker" to decide which string I'm going to be working with. Let's say I chose <span className='code-block'>*</span>, and add the two substitutions <span className='code-block'>^1=>^1*</span> and <span className='code-block'>^0=>^0*</span>. Let's assume our input is the palindrome <span className='code-block'>^10101$</span>. After one round, the output will be <span className='code-block'>^1*0101$</span>, indicating that we're working with the first bit.
          </div>
          <div className='space'>Next, we use the four rules <span className='code-block'>1*1=>11*, 1*0=>01, 0*1=>10*, 0*0=>00*</span> to "walk" the marked bit all the way to the end. Here's what the string would be after each round:
          </div>
          <div className='space box'>
            Round 1: &nbsp; ^1*0101$<br/>
            Round 2: &nbsp; ^01*101$<br/>
            Round 3: &nbsp; ^011*01$<br/>
            Round 4: &nbsp; ^0101*1$<br/>
          </div>
          <div className='space'>Now that the marked bit is at the end, we can use the rules <span className='code-block'>1*1$=>$, 0*0$=>$, 1*0$=>x, 0*1$=>x</span> to compare the two bits. If the two bits are the same, they get subsumed into the <span className='code-block'>$</span>, and if they're different I mark it with an <span className='code-block'>x</span>. Note that once an <span className='code-block'>x</span> has been marked, we need not check any further and can fold the whole string down to a character. If the bits were indeed the same, we continue.
          </div>
          <div className='space'>Finally, the whole process repeats and we'd end up with either <span className='code-block'>^x, ^$, ^1$</span>, or <span className='code-block'>^0$</span> (the latter three being palindromes). We add the rules <span className='code-block'>1x=>x, 0x=>x, ^x=>not_palindrome, ^$=>palindrome, ^1$=>palindrome, ^0$=>palindrome</span>, and we're done.
          </div>
          <div className='space'><b>Level 6.</b> To pass the final level, we must implement a binary adder. Let's assume that our input is <span className='code-block'>^101+111=1100$</span> (and the expected output is <span className='code-block'>'Correct'</span>). We can use the same trick we used in level 5 and "walk" the LSB of the first number (the first character before the <span className='code-block'>+</span>) all the way to the LSB of the second number (the first character before the <span className='code-block'>=</span>) and do a comparison.
          </div>
          <div className='space'>Except, when adding two bits, we need to consider the carry bit. To do this, we can again borrow an idea from the previous level by creating a "marker" and using it as a state variable to store the carry bit. I chose the character <span className='code-block'>'c'</span> (to denote that the carry flag was set) and the string <span className='code-block'>'nc'</span> (to denote that the carry flag was not set) and placed them just after the <span className='code-block'>+</span>. These 4 setup rules were <span className='code-block'>1==>1nc=, 0==>0nc=, 1+=>1*+, 0+=>0*+</span>.
          </div>
          <div className='space box'>
            Round 1: &nbsp; ^101*+111nc=1100$
          </div>
          <div className='space'>Next, we can "walk" the LSB of the first number to the LSB of the second number using the rules <span className='code-block'>1*+=>+1*, =>0*+=>+0*, 1*1=>11*, 1*0=>01*, 0*0=>00*, 0*1=>10*</span>.
          </div>
          <div className='space box'>
            Round 2: &nbsp; ^10+1*111nc=1100$<br/>
            Round 3: &nbsp; ^10+11*11nc=1100$<br/>
            Round 4: &nbsp; ^10+111*1nc=1100$<br/>
          </div>
          <div className='space'>Now that the LSBs are together, we can finally do the addition. Note that because of the carry bit, there are 8 possible outcomes: <span className='code-block'>0*0nc==>nc=0*, 0*0c==>nc=1*, 0*1nc==>nc=1*, 0*1c==>c=0*, 1*0nc==>nc=1*, 1*0c==>c=0*, 1*1nc==>c=0*, 1*1c==>c=1*</span>.
          </div>
          <div className='space box'>
            Round 5: &nbsp; ^10+11c=0*1100$<br/>
            Round 6: &nbsp; ^10+11c=10*100$<br/>
            Round 7: &nbsp; ^10+11c=110*00$<br/>
            Round 8: &nbsp; ^10+11c=1100*0$<br/>
          </div>
          <div className='space'>Finally, now that the aggregated bit is at the end, we can compare it with the LSB of the result. If they match, it gets subsumed into a $, and if not, we mark it with an <span className='code-block'>x</span>: <span className='code-block'>0*0$=>$, 1*1$=>$, 0*1$=>x, 1*0$=>x</span>.
          </div>
          <div className='space box'>
            Round 9: &nbsp; ^10+11c=110$
          </div>
          <div className='space'>The cycle then repeats until we reach the edge cases. There are two possible scenarios: Either a calculation went wrong somewhere along the line and we fold the string down using <span className='code-block'>ncx=>x, cx=>x, ^x=>x, +x=>x, =x=>x, 1x=>x, 0x=>x, x=>incorrect</span>, or everything worked out fine and we would end up with <span className='code-block'>^0+0c=1$=>correct, ^0+0nc=0$=>correct</span>. One more thing to note is that the numbers maybe padded with upto 3 zeroes, so we need to pad all inputs with zeroes whenever required: <span className='code-block'>+c=>+0c, +nc=>+0nc, ^+=>^0+, =$=>=0$</span>. Here's the full script:
          </div>
          <Code>{code2}</Code>
        </div>
      </div>
    );
  }
}

export default PickledOnions;

