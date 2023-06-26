import React, { Component } from 'react';
import Latex from 'react-latex';
import MathJax from 'react-mathjax2'
import Code from '../CodeBlock';
import ReactMarkdown from 'react-markdown';
import Title from '../Title';

const code1 = `ubuntu@ubuntu1604 $ python3.8 ./chall.py 
What is the flag? foo
Nope!`;

const code2 = `from pickle import loads
from pickletools import dis

fil = open('chall.py', 'rb')
pickle = eval(fil.read()[27:-1])
fil.close()

dis(pickle)`;

const code3 = `     0: (        MARK
     1: I        INT        128
     6: I        INT        4
     9: I        INT        99
    13: I        INT        112

............................................
............................................
............................................
............................................

544256: I        INT        82
544260: I        INT        133
544265: I        INT        82
544269: I        INT        46
544273: t        TUPLE      (MARK at 0)
544274: p        PUT        69420
544281: c        GLOBAL     'pickle loads'
544295: c        GLOBAL     'builtins bytes'
544311: g        GET        69420
544318: \\x85     TUPLE1
544319: R        REDUCE
544320: \\x85     TUPLE1
544321: R        REDUCE
544322: .        STOP`;

const code4 = `from pwn import process

def parse():
    p1 = process(['python3', '-m', 'pickletools', 'tmp'])

    o = []

    while True:
        try:
            o.append(p1.recvline())
        except:
            break

    p1.close()

    return o

def put(x):
    tt = open('tmp', 'wb')
    tt.write(x)
    tt.close()

put(pickle)
nested_pickle = parse()[1:-21]
nested_pickle = bytes([int(a.split()[-1]) for a in nested_pickle])

dis(nested_pickle)`;

const code5 =`119451: \\x8c     SHORT_BINUNICODE 'pickledgreekoregano'
119472: \\x8c     SHORT_BINUNICODE '\\nI'
119476: \\x8c     SHORT_BINUNICODE 'pickledpupunha'
119492: \\x8c     SHORT_BINUNICODE 'Nope!'
119499: \\x8c     SHORT_BINUNICODE 'Correct!'
119509: \\x86     TUPLE2
119510: \\x8c     SHORT_BINUNICODE 'pickledximenia'
119526: c        GLOBAL           'builtins input'
119542: \\x8c     SHORT_BINUNICODE 'What is the flag? '
119562: \\x85     TUPLE1
119563: R        REDUCE
119564: \\x8c     SHORT_BINUNICODE 'pickledgarlic'
119579: \\x8c     SHORT_BINUNICODE 'pickledcorneliancherry'
119603: \\x8c     SHORT_BINUNICODE 'pickledboysenberry'
119623: \\x86     TUPLE2
119624: d        DICT             (MARK at 13)
119625: b        BUILD
119626: (        MARK
119627: \\x8c     SHORT_BINUNICODE 'pickledburmesegrape'
119648: c        GLOBAL           'io pickledximenia.__len__'
119675: )        EMPTY_TUPLE
119676: R        REDUCE
119677: \\x8c     SHORT_BINUNICODE 'pickledximenia'
119693: c        GLOBAL           'io pickledximenia.encode'
119719: )        EMPTY_TUPLE
119720: R        REDUCE
119721: d        DICT             (MARK at 119626)
119722: b        BUILD
119723: c        GLOBAL           'builtins print'
119739: c        GLOBAL           'io pickledpupunha.__getitem__'
119770: c        GLOBAL           'pickle loads'
119784: \\x8c     SHORT_BINUNICODE 'io'
119788: c        GLOBAL           'io pickledgarlic.__getitem__'
119818: c        GLOBAL           'io pickledburmesegrape.__eq__'
119849: I        INT              64
119853: \\x85     TUPLE1
119854: R        REDUCE
119855: \\x85     TUPLE1
119856: R        REDUCE
119857: \\x93     STACK_GLOBAL
119858: \\x85     TUPLE1
119859: R        REDUCE
119860: \\x85     TUPLE1
119861: R        REDUCE
119862: \\x85     TUPLE1
119863: R        REDUCE
119864: .        STOP`;

const code6 = `loads(nested_pickle)
What is the flag? foo
Nope!
from io import pickledburmesegrape
pickledburmesegrape
4`

const code7 = `loads(nested_pickle)
What is the flag? flag{aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
Nope!
from io import pickledboysenberry
loads(pickledboysenberry)
0
dis(pickledboysenberry)`;

const code8 = `118689: \\x85     TUPLE1
118690: R        REDUCE
118691: d        DICT       (MARK at 20992)
118692: b        BUILD
118693: c        GLOBAL     'pickle loads'
118707: c        GLOBAL     'io pickledcedarbaycherry'
118733: \\x85     TUPLE1
118734: R        REDUCE
118735: .        STOP`

const code9 = `from io import pickledcedarbaycherry
dis(pickledcedarbaycherry)
from io import pickledhuito
dis(pickledhuito)`;

const code10 = `    0: \\x80 PROTO      4
    2: I    INT        102
    7: I    INT        108
   12: I    INT        97
   16: I    INT        103
   21: I    INT        123
   26: I    INT        97
   30: I    INT        97
   34: I    INT        97
   38: I    INT        97
   42: I    INT        97
   46: I    INT        97
   50: I    INT        97
   54: I    INT        97
   58: I    INT        97
   62: I    INT        97
   66: I    INT        97
   70: I    INT        97
   74: I    INT        97
   78: I    INT        97
   82: I    INT        97
   86: I    INT        97
   90: I    INT        97
   94: I    INT        97
   98: I    INT        97
  102: I    INT        97
  106: I    INT        97
  110: I    INT        97
  114: I    INT        97
  118: I    INT        97
  122: I    INT        97
  126: I    INT        97
  130: I    INT        97
  134: I    INT        97
  138: I    INT        97
  142: I    INT        97
  146: I    INT        97
  150: I    INT        97
  154: I    INT        97
  158: I    INT        97
  162: I    INT        97
  166: I    INT        97
  170: I    INT        97
  174: I    INT        97
  178: I    INT        97
  182: I    INT        97
  186: I    INT        97
  190: I    INT        97
  194: I    INT        97
  198: I    INT        97
  202: I    INT        97
  206: I    INT        97
  210: I    INT        97
  214: I    INT        97
  218: I    INT        97
  222: I    INT        97
  226: I    INT        97
  230: I    INT        97
  234: I    INT        97
  238: I    INT        97
  242: I    INT        97
  246: I    INT        97
  250: I    INT        97
  254: I    INT        97
  258: I    INT        97
  262: I    INT        10
  266: 0    POP
  267: 0    POP
  268: 0    POP
  269: 0    POP
  270: 0    POP
  271: 0    POP
  272: 0    POP
  273: 0    POP
  274: 0    POP
  275: 0    POP
  276: 0    POP
  277: 0    POP
  278: 0    POP
  279: 0    POP
  280: 0    POP
  281: 0    POP
  282: 0    POP
  283: 0    POP
  284: 0    POP
  285: 0    POP
  286: 0    POP
  287: 0    POP
  288: 0    POP
  289: 0    POP
  290: 0    POP
  291: 0    POP
  292: 0    POP
  293: 0    POP
  294: 0    POP
  295: 0    POP
  296: 0    POP
  297: 0    POP
  298: 0    POP
  299: 0    POP
  300: 0    POP
  301: 0    POP
  302: 0    POP
  303: 0    POP
  304: 0    POP
  305: 0    POP
  306: 0    POP
  307: 0    POP
  308: 0    POP
  309: 0    POP
  310: 0    POP
  311: 0    POP
  312: 0    POP
  313: 0    POP
  314: 0    POP
  315: 0    POP
  316: 0    POP
  317: 0    POP
  318: 0    POP
  319: 0    POP
  320: 0    POP
  321: 0    POP
  322: 0    POP
  323: 0    POP
  324: 0    POP
  325: 0    POP
  326: 0    POP
  327: 0    POP
  328: 0    POP
  329: p    PUT        0
  332: 0    POP
  333: c        GLOBAL           'pickle io'
  344: (        MARK
  345: \\x8c     SHORT_BINUNICODE 'pickledmacadamia'
  363: g        GET              0
  366: \\x8c     SHORT_BINUNICODE 'pickledbarberry'
  383: I        INT              102
  388: \\x8c     SHORT_BINUNICODE 'pickledgarlic'
  403: \\x8c     SHORT_BINUNICODE 'pickledcorneliancherry'
  427: \\x8c     SHORT_BINUNICODE 'pickledbluetongue'
  446: \\x86     TUPLE2
  447: d        DICT             (MARK at 344)
  448: b    	BUILD
  449: c    	GLOBAL           'pickle loads'
  463: \\x8c 	SHORT_BINUNICODE 'io'
  467: c    	GLOBAL           'io pickledgarlic.__getitem__'
  497: c    	GLOBAL           'pickle loads'
  511: c    	GLOBAL           'io pickledcrabapple'
  532: \\x85 	TUPLE1
  533: R        REDUCE
  534: \\x85     TUPLE1
  535: R        REDUCE
  536: \\x93     STACK_GLOBAL
  537: \\x85     TUPLE1
  538: R        REDUCE
  539: .        STOP`;

const code11 = `    0: \\x80 PROTO      4
    2: c    GLOBAL     'pickle io'
   13: c    GLOBAL     'io pickledmacadamia.__eq__'
   41: c    GLOBAL     'io pickledbarberry'
   61: \\x85 TUPLE1
   62: R    REDUCE
   63: .    STOP`;

const code12 = `    0: \\x80 PROTO      4
    2: I    INT        102
    7: I    INT        108
   12: I    INT        97
   16: I    INT        103
   21: I    INT        123
   26: I    INT        97
   30: I    INT        97
   34: I    INT        97
   38: I    INT        97
   42: I    INT        97
   46: I    INT        97
   50: I    INT        97
   54: I    INT        97
   58: I    INT        97
   62: I    INT        97
   66: I    INT        97
   70: I    INT        97
   74: I    INT        97
   78: I    INT        97
   82: I    INT        97
   86: I    INT        97
   90: I    INT        97
   94: I    INT        97
   98: I    INT        97
  102: I    INT        97
  106: I    INT        97
  110: I    INT        97
  114: I    INT        97
  118: I    INT        97
  122: I    INT        97
  126: I    INT        97
  130: I    INT        97
  134: I    INT        97
  138: I    INT        97
  142: I    INT        97
  146: I    INT        97
  150: I    INT        97
  154: I    INT        97
  158: I    INT        97
  162: I    INT        97
  166: I    INT        97
  170: I    INT        97
  174: I    INT        97
  178: I    INT        97
  182: I    INT        97
  186: I    INT        97
  190: I    INT        97
  194: I    INT        97
  198: I    INT        97
  202: I    INT        97
  206: I    INT        97
  210: I    INT        97
  214: I    INT        97
  218: I    INT        97
  222: I    INT        97
  226: I    INT        97
  230: I    INT        97
  234: I    INT        97
  238: I    INT        97
  242: I    INT        97
  246: I    INT        97
  250: I    INT        97
  254: I    INT        97
  258: I    INT        97
  262: I    INT        10
  266: 0    POP
  267: 0    POP
  268: 0    POP
  269: 0    POP
  270: 0    POP
  271: 0    POP
  272: 0    POP
  273: 0    POP
  274: 0    POP
  275: p    PUT        1
  278: 0    POP
  279: 0    POP
  280: 0    POP
  281: 0    POP
  282: 0    POP
  283: 0    POP
  284: 0    POP
  285: 0    POP
  286: 0    POP
  287: 0    POP
  288: 0    POP
  289: 0    POP
  290: 0    POP
  291: 0    POP
  292: 0    POP
  293: 0    POP
  294: 0    POP
  295: 0    POP
  296: 0    POP
  297: 0    POP
  298: 0    POP
  299: 0    POP
  300: 0    POP
  301: 0    POP
  302: 0    POP
  303: 0    POP
  304: 0    POP
  305: 0    POP
  306: 0    POP
  307: 0    POP
  308: 0    POP
  309: 0    POP
  310: 0    POP
  311: 0    POP
  312: 0    POP
  313: 0    POP
  314: 0    POP
  315: 0    POP
  316: 0    POP
  317: 0    POP
  318: 0    POP
  319: 0    POP
  320: 0    POP
  321: 0    POP
  322: 0    POP
  323: 0    POP
  324: 0    POP
  325: 0    POP
  326: 0    POP
  327: 0    POP
  328: p    PUT        0
  331: 0    POP
  332: 0    POP
  333: 0    POP
  334: 0    POP
  335: 0    POP
  336: c    GLOBAL     'pickle io'
  347: (    MARK
  348: \\x8c     SHORT_BINUNICODE 'pickledmacadamia'
  366: g        GET        0
  369: \\x8c     SHORT_BINUNICODE 'pickledbarberry'
  386: g        GET        1
  389: \\x8c     SHORT_BINUNICODE 'pickledgarlic'
  404: \\x8c     SHORT_BINUNICODE 'pickledcorneliancherry'
  428: \\x8c     SHORT_BINUNICODE 'pickledarugula'
  444: \\x86     TUPLE2
  445: d        DICT       (MARK at 347)
  446: b    BUILD
  447: c    GLOBAL     'pickle loads'
  461: \\x8c SHORT_BINUNICODE 'io'
  465: c    GLOBAL     'io pickledgarlic.__getitem__'
  495: c    GLOBAL     'pickle loads'
  509: c    GLOBAL     'io pickledeasternmayhawthorn'
  539: \\x85 TUPLE1
  540: R    REDUCE
  541: \\x85 TUPLE1
  542: R    REDUCE
  543: \\x93 STACK_GLOBAL
  544: \\x85 TUPLE1
  545: R    REDUCE
  546: .    STOP`;

const code13 = `from io import pickledcoconut
from io import pickledhorseradish
from io import pickledlychee

dis(pickledcoconut)
    0: \\x80 PROTO      4
    2: c    GLOBAL     'pickle io'
   13: c    GLOBAL     'io pickledmacadamia.__sub__'
   42: c    GLOBAL     'io pickledbarberry'
   62: \\x85 TUPLE1
   63: R    REDUCE
   64: .    STOP

dis(pickledhorseradish)
    0: \\x80 PROTO      4
    2: c    GLOBAL     'pickle io'
   13: c    GLOBAL     'io pickledmacadamia.__add__'
   42: c    GLOBAL     'io pickledbarberry'
   62: \\x85 TUPLE1
   63: R    REDUCE
   64: .    STOP

dis(pickledlychee)
    0: \\x80 PROTO      4
    2: c    GLOBAL     'pickle io'
   13: c    GLOBAL     'io pickledmacadamia.__xor__'
   42: c    GLOBAL     'io pickledbarberry'
   62: \\x85 TUPLE1
   63: R    REDUCE
   64: .    STOP`;

const code14 = `from pdb import set_trace
from pickle import loads
from pickletools import dis
from pwn import process
import sys

known = ['f', 'l', 'a', 'g', '{'] + [None] * 59

def undo_add(a, s):
    return s - a

def undo_xor(a, x):
    return a ^ x

def undo_sub(a, b, s):
    if a:
        return a - s
    else:
        return b + s

def undo_op(idx1, idx2, result, condition):
    if idx1 < 0 or idx2 < 0 or condition not in [b'pickledhorseradish',
                                                 b'pickledlychee',
                                                 b'pickledcoconut']:
        return

    if known[idx1] or known[idx2]:
        if known[idx1]:
            a = ord(known[idx1])
        else:
            a = ord(known[idx2])
        if condition == b'pickledhorseradish':
            b = undo_add(a, result)
        if condition == b'pickledlychee':
            b = undo_xor(a, result)
        if condition == b'pickledcrabapple':
            b = a
        if condition == b'pickledcoconut':
            if known[idx1]:
                b = undo_sub(a, None, result)
            else:
                b = undo_sub(None, a, result)

        if known[idx1]:
            known[idx2] = chr(b)
        else:
            known[idx1] = chr(b)

def parse(c1_lim=5):
    p1 = process(['python3', '-m', 'pickletools', 'tmp'])

    c1 = 0
    c2 = 0
    searching_for_cond = False
    idx = 63
    idx1 = -1
    idx2 = -1

    while True:
        try:
            line = p1.recvline().split()
            data = [a.strip() for a in line]
            
            # PUSH
            if data[1] == b'0':
                idx -= 1

            # find target indices
            if data[1] == b'p':
                if data[3] == b'0':
                    if idx1 == -1:
                        idx1 = idx
                elif data[3] == b'1':
                    if idx2 == -1:
                        idx2 = idx

            # find next check
            if data[1] == b'\\x8c':
                c1 += 1
                if c1 == c1_lim:
                    nxt = data[3][1:-1]

            if searching_for_cond:
                c2 += 1

            if data[-1][:5] == b'loads':
                searching_for_cond = True
            
            # find the type of check and the result
            if searching_for_cond:
                if c2 == 4:
                    # sometimes MARK shows up unexpectedly, ignore
                    if data[-1] == b'MARK':
                        c2 = 1
                        continue
                    condition = data[-1][:-1]
                
                if c2 == 8:
                    result = data[-1]
                    try:
                        result = int(result)
                    except:
                        pass
            
        except:
            break

    p1.close()
    undo_op(idx1, idx2, result, condition)

    return nxt

def put(x):
    tt = open('tmp', 'wb')
    tt.write(x)
    tt.close()

fil = open('chall.py', 'rb')
pickle = eval(fil.read()[27:-1])

loads(pickle)

from io import pickledgarlic

exec('from io import ' + pickledgarlic[1])
module = eval(pickledgarlic[1])

put(module)
loads(module)

from io import pickledcedarbaycherry

put(pickledcedarbaycherry)
nxt = parse(c1_lim=3)
exec('from io import ' + nxt.decode())
nxt = eval(nxt)

first = nxt

while True:
    put(nxt)
    
    found = [a for a in known if a is not None]
    if len(found) >= 64:
        break

    try:
        nxt = parse()
    except:
        if len(found) < 64:
            nxt = first
            continue
        else:
            break

    print(''.join(found))
    exec('from io import ' + nxt.decode())
    nxt = eval(nxt)

print(''.join(found))`

class PickledOnions extends Component {
  render() {
    return (
      <div className='main'>
        <div className='content'>
          <Title title={this.props.title} date={this.props.date} cat={this.props.cat} />
          <div><b>Description. </b>In this challenge, we're given a <a href="https://raw.githubusercontent.com/gov-ind/ctf_solves/main/2021/redpwn/pickled_onions/chall.py">script</a> that simply loads a pickle, prompts for a flag, and then outputs either 'Nope!' or 'Correct!'.
          </div>
          <Code>{code1}</Code>
          <div className='space'>The most straightforward way to inspect pickles is by using the the <span class='code-block'>dis</span> function from the <span class='code-block'>pickletools</span> module. We can then read the source, <span class='code-block'>eval</span> the relevant portion as bytes, and pass it to <span class='code-block'>dis</span>.
          </div>
          <Code>{code2}</Code>
          <div className='space'>For this challenge, we'll need to know a bit about pickle's bytecode spec. I'll try to explain as much as possible along the way, but if you need a more detailed explanation about the pickle VM, have a look <a href='https://checkoway.net/musings/pickle/'>here</a>, <a href='https://intoli.com/blog/dangerous-pickles/'>here</a>, and <a href='https://adrianstoll.com/computer-insecurity/python-in-a-pickle.html'>here</a>. Moving on, here's a part of <span class='code-block'>dis</span>'s output:
          </div>
          <Code>{code3}</Code>
          <div className='space'>The first column is for the memory address, the second (with the single byte) is for the opcode, the third is for the mnemonic, and the fourth is for the payload. At the address <span class='code-block'>0</span>, a <span class='code-block'>MARK</span> is placed, and then every instruction until the address <span class='code-block'>544269</span> pushes a single byte on the stack one at a time. The next two instructions create a tuple out of these bytes and place this tuple into the memo at the address <span class='code-block'>69420</span>. The instructions starting at <span class='code-block'>544311</span> pick up this tuple from the memo, reduce it once (so that <span class='code-block'>bytes</span> is called on it), then reduce it again (so that <span class='code-block'>pickle.loads</span> is called on it). Basically, all that's happened so far is something like <span class='code-block'>loads(bytes([128, 4, ..., 46]))</span>. In other words, this is just an unpacker that loads another pickle, and we need to disassemble this nested pickle.
          </div>
          <div className='space'>
            Before we continue, we need to address on problem: <span class='code-block'>dis</span> writes to stdout, so there's no way for us to work with its output at runtime. As a quick workaround, we can write <span class='code-block'>dis</span>'s output to a file and then read from the file.
          </div>
          <Code>{code4}</Code>
          <div className='space'>Here's the output:</div>
          <Code>{code5}</Code>
          <div className='space'>This bytecode looks like it's working with a bunch of pickle-themed variables. However, we cannot inspect these variables because it hasn't been loaded into memory yet (so far we've merely disassembled pickle). To actually run it, we need to load the pickle.
          </div>
          <Code>{code6}</Code>
          <div className='space'>If you poke around a bit, you should be able to explore most of the bytecode via the shell itself. Here are the highlights: The input's  length (<span class='code-block'>pickledburmesegrape</span>) is verified to be 64 (addresses <span className='code-block'>119818</span> to <span className='code-block'>119853</span>), and if it is, the first item of the dictionary <span className='code-block'>pickledgarlic</span> is loaded. This item turns out to be the variable <span className='code-block'>pickledboysenberry</span> (Line <span className='code-block'>119603</span>). Of course, our input (foo) was only 4 bytes long (including the new line), so let's retry the whole thing and this time pass a 64 byte string starting with 'flag' and then inspect <span class='code-block'>pickledboysenberry</span>.
          </div>
          <Code>{code7}</Code>
          <div className='space'>Here's the tail of the disassembly:</div>
          <Code>{code8}</Code>
          <div className='space'>Digging into the more pickles, we finally reach this one:
          </div>
          <Code>{code9}</Code>
          <div className='space'>Here's its dissasembly:</div>
          <Code>{code10}</Code>
          <div className='space'>Lines <span class='code-block'>2</span> to <span class='code-block'>262</span> push our input on the stack, while the following instructions pop them one by one until it reaches instruction <span class='code-block'>332</span>, which pushes, in this case, the first character of our input, 'f' on the memo. Next, <span class='code-block'>pickledmacadamia</span> is set to this memo variable (line <span class='code-block'>363</span>), <span class='code-block'>pickledbarberry</span> is set to 102 (line <span class='code-block'>383</span>) and <span class='code-block'>pickledcrabapple</span> is loaded and invoked. If it succeeds, <span class='code-block'>pickledbluetongue</span> is loaded (presumably to check the second character), and if it fails, the first item of the dictionary is picked (and leads back to the <span class='code-block'>print('Nope')</span>). This is just one check in the link; In all, there would be a huge link of checks and if any one of them fails, the whole thing fails. Let's look at the disassembly of the first check, <span class='code-block'>pickledcrabapple</span>:
          </div>
          <Code>{code11}</Code>
          <div className='space'>Pretty simple: All it does is check whether <span class='code-block'>pickledmacadamia</span> and <span class='code-block'>pickledbarberry</span> are equal. In this case, it checks that the first character of our input is the byte 102 ('f'). If you follow the trail of pickles, you'll see that the first four checks basically check for the characters f, l, a, and g. However, the remaining checks are not this straightforward. For example, the check for the fifth character, <span class='code-block'>pickledvoavanga</span>, is slightly different:
          </div>
          <Code>{code12}</Code>
          <div>Very similar, except that line <span class='code-block'>386</span> now sets <span class='code-block'>pickledbarberry</span> to a character in our input (which was put on the memo at line <span className='code-block'>275</span>) instead of a hardcoded value. Moreover, the check (<span class='code-block'>pickledeasternmayhawthorn</span>) isn't a simple equality, but a greater than or equal to operator. In other words, it tells us whether the fifth character in our input is greater than or equal to some nth character in our input. Not very helpful. After a while of searching, I found three checks which <i>do</i> help:
          </div>
          <Code>{code13}</Code>
          <div>These three checks return the sum, difference, or xor of two characters at positions <span class='code-block'>m</span> and <span class='code-block'>n</span>. This means that if by some chance <span class='code-block'>m</span> happens to be 0, 1, 2, 3, or 4 (characters we know), then we can undo the operation to recover the character at position <span class='code-block'>n</span>. To be more concrete, let's say we come across a pickle that checks whether the xor of the 1st character and the 41st character is 90. Because xor is reversible, this immediately reveals that the 41st character is the the xor of the first character and 90. We can then add this newly discovered character to our list of known characters and then keep looking for more checks that recover other characters.
          </div>
          <div className='space'>Obviously, going through each check manually is tedious, so we need some way to parse the bytecode into an AST of some sort. There's a library called <a href='https://github.com/trailofbits/fickling'>fickling</a> that does just this, but unfortunately it doesn't support the <span class='code-block'>DICT</span> opcode at the moment. Thankfully, it isn't that hard to write an ad-hoc parser from scratch (especially considering that we only need to extract a few details). Specifically, we'll need to extract the character indices that are being checked, the expected result of the check, the current check, and the next check. For example, if it checks that characters 4 and 47 sum to 218, then we'll need to extract the values 4, 47, sum, and 218 (in addition to the next check in the link). Once we have this, we can reverse the operation to recover the character at index 47, and can repeat these steps for the next check. Finally, all we need to do is run this forever until we've recovered all 64 characters. Here's the full script (<span class='code-block'>python3.8 -c "print('flag{'{'}' + 'a' * 64)" | python3.8 ./solve.py</span>).
          </div>
          <Code>{code14}</Code>
        </div>
        <div>&nbsp;</div>
      </div>
    );
  }
}

export default PickledOnions;
