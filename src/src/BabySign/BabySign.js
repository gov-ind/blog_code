import React, { Component } from 'react';
import Code from '../CodeBlock';
import katex from 'katex';
import Title from '../Title';

// atomOneDark
// atelierSeaside
// darcula
// dark
// dracula
// hybrid
// nord           1
// ocean          3
// shadesOfPurple 5
// tomorrowNightBlue 4
// vs2015         2

const chall = `from Crypto.Util.number import getPrime, GCD, inverse, bytes_to_long
import os

class SecureSigner():
	def __init__(self):
		p = getPrime(512)
		q = getPrime(512)
		e = 0x10001
		phi = (p-1)*(q-1)
		while GCD(e,phi) != 1:
			p = getPrime(512)
			q = getPrime(512)
			phi = (p-1)*(q-1)

		self.d = inverse(e,phi)
		self.n = p * q
		self.e = e

	def sign(self, message):
		return pow(message,self.d,self.n)

	def verify(self, message, signature):
		return pow(signature,self.e,self.n) == message



def menu():
	print(
		"""
		1 - Sign an 8-bit integer
		2 - Execute command
		3 - Exit
		"""
		)
	choice = input("Choice: ")
	if choice == "1":
		try:
			m = int(input("Integer to sign: "))
			if 0 <= m < 256:
				print("Signature: {:d}".format(s.sign(m)))
			else:
				print("You can only sign 8-bit integers.")
		except:
			print("An error occured.")
			exit(1)
	elif choice == "2":
		try:
			cmd = input("Command: ")
			m = bytes_to_long(cmd.encode())
			signature = int(input("Signature: "))
			if s.verify(m,signature):
				os.system(cmd)
			else:
				print("Wrong signature.")
		except:
			print("An error occured.")
			exit(1)
	elif choice == "3":
		exit(0)
	else:
		print("Incorrect input.")
		exit(1)




if __name__ == '__main__':
	s = SecureSigner()

	print("Here are your parameters:\n - modulus n: {:d}\n - public exponent e: {:d}\n".format(s.n, s.e))
	
	while True:
		menu()`

const chall2 = `from Crypto.Util.number import  inverse, isPrime
from random import SystemRandom
from hashlib import sha256
from flag import FLAG
import os

rand = SystemRandom()

class ElGamal:
	def __init__(self):
		self.q = 89666094075799358333912553751544914665545515386283824011992558231120286657213785559151513056027280869020616111209289142073255564770995469726364925295894316484503027288982119436576308594740674437582226015660087863550818792499346330713413631956572604302171842281106323020998625124370502577704273068156073608681
		assert(isPrime(self.q))
		self.p = 2*self.q + 1
		assert(isPrime(self.p))
		self.g = 2
		self.H = sha256
		self.x = rand.randint(1,self.p-2)
		self.y = pow(self.g,self.x,self.p)

	def sign(self,m):
		k = rand.randint(2,self.p-2)
		while GCD(k,self.p-1) != 1:
			k = rand.randint(2,self.p-2)
		r = pow(self.g,k,self.p)
		h = int(self.H(m).hexdigest(),16)
		s = ((h - self.x * r)* inverse(k,self.p-1)) % (self.p - 1)
		assert(s != 0)
		return (r,s)

	def verify(self,m,r,s):
		if r <= 0 or r >= (self.p):
			return False
		if s <= 0 or s >= (self.p-1):
			return False
		h = int(self.H(m).hexdigest(),16)
		return pow(self.g,h,self.p) == (pow(self.y,r,self.p) * pow(r,s,self.p)) % self.p



if __name__ == '__main__':
	S = ElGamal()

	print("Here are your parameters:\n - generator g: {:d}\n - prime p: {:d}\n - public key y: {:d}\n".format(S.g, S.p, S.y))
	
	message = os.urandom(16)

	print("If you can sign this message : {:s}, I'll reward you with a flag!".format(message.hex()))

	r = int(input("r: "))
	s = int(input("s: "))
	if S.verify(message,r,s):
		print(FLAG)
	else:
		print("Nope.")`

const sol1 = `from hashlib import sha256
from math import gcd
from pwn import remote, process

debug = False

while True:
    if debug:
        p1 = process(['python3.8', 'server.py'])
    else:
        p1 = remote('remote1.thcon.party', 11002)

    p1.recvline()

    g = int(p1.recvline().split(b': ')[1].strip())
    p = int(p1.recvline().split(b': ')[1].strip())
    y = int(p1.recvline().split(b': ')[1].strip())

    p1.recvline()

    message = bytes.fromhex(p1.recvline().split(b': ')[1].split(b',')[0].decode())

    q = (p - 1) // 2
    k = (p - 3) // 2

    if pow(y, q, p) == 1:
        z = 2
    else:
        z = 1

    h2 = int(sha256(message).hexdigest(), 16) - q * z
    f = gcd(k, p - 1)

    k_i = pow(k // f, -1 , (p - 1) // f)

    if h2 % f == 0:
        s = (h2 // f) * k_i % ((p - 1) // f)
        r = pow(g, k, p)

        p1.sendline(f'{r}')
        p1.sendline(f'{s}')

        vv = p1.recvline()
        print(vv.split(b"b'")[-1][:-2].strip())

        break`

const m1 = 'S^d \\equiv m^{ed} \\equiv m^{k\\phi + 1} \\equiv m^{k\\phi}m \\equiv m \\pmod n'

const m2 = '2^{-40}'
const m3 = 'k = \\frac{(p - 3)}{2}';
const m4 = `\\begin{aligned}
r &\\equiv g^k \\pmod p \\\\
  &\\equiv g^{\\frac{p - 3}{2}} \\pmod p \\\\
  &\\equiv g^{\\frac{p - 1}{2}}g^{-1} \\pmod p \\\\
  &\\equiv (p - 1) g^{-1} \\pmod p \\\\
  &\\equiv \\frac{p - 1}{g} \\pmod p \\\\
  &\\equiv q \\pmod p
\\end{aligned}`;

const m5 = 'g^{\\frac{p - 1}{2}}';

const m6 = `\\begin{aligned}
g^h &\\equiv r^sy^r \\pmod p \\\\
    &\\equiv g^{k(h - xr)k^{-1}}g^{xr} \\pmod p \\\\
    &\\equiv g^{h - xr}g^{xr} \\pmod p
\\end{aligned}`;

const m7 = 'g^{h - xr}'

const m8 = 'g^{xr} \\equiv g^{xq} \\equiv (g^q)^x \\equiv g^{\\frac{p - 1}{2}} \\equiv -1^x';

const m9 = 's \\equiv (h - xr)k^{-1}';
const m10 = '(h - zq)k^{-1}';

const m11 = 'k^{-1} \\pmod {p -1}';
const m12 = 'k = \\frac{p - 3}{2}';
const m13 = 'k_{1}^{-1}';
const m14 = 'kk_{1}^{-1} \\equiv f \\pmod {p - 1}';
const m15 = 's \\equiv (h - zq) \\pmod {p - 1}';
const m16 = `\\begin{aligned}
r^s &\\equiv g^{k(h - zq)k^{-1}} \\pmod {p - 1} \\\\
    &\\equiv g^{{kk^{-1}}(h - zq)} \\pmod {p - 1} \\\\
    &\\equiv g^{f(h - zq)} \\pmod {p - 1}
\\end{aligned}`;
const m17 = 'g^{xr} \\equiv g^{xq} \\equiv ({g^q})^x \\equiv \\pm 1 \\pmod p'
const m18 = 'y^{q} \\equiv g^{xq} \\equiv 1 \\pmod p';
const m19 = 'g^{zq} \\equiv ({g^q})^z \\equiv -1^z \\equiv -1^2 \\equiv 1 \\pmod p';
const m20 = 'g^\\frac{p - 1}{2} \\equiv -1 \\pmod p';
const m21 = '\\mathbb{Z}_p';
const m22 = 'g^{p - 1} \\equiv 1 \\pmod p';
const m23 = '\\frac{p - 1}{2}';
const m24 = 'g^{\\frac{p - 1}{2}} \\pmod p';
const m25 = '\\frac{p - 1}{g} = \\frac{p - 1}{2} = q';

const m26 = `\\begin{aligned}
p &= 4y_1 + 3 \\\\
\\implies p - 1 &= 4y_1 + 2 \\\\
k &= \\frac{p - 3}{2} \\\\
  &= \\frac{4y_1}{2} \\\\
  &= 2y_1
\\end{aligned}`;

const m27 = `\\begin{aligned}
z_2X &= y_1 \\\\
\\implies 2z_2X &= 2y_1 \\\\
z_1X &= 2y_1 + 1 \\\\
\\implies (z_1 - 2z_2)X &= 1
\\end{aligned}`;

const eq1 = `\\begin{aligned}
r &= g^k \\pmod p \\\\
s &= (h - xr)k^{-1} \\pmod{p - 1} \
\\end{aligned}`;

class L1 extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
  }

  componentDidMount() {//let a = katex;debugger;
    katex.render(this.props.children, this.myRef.current, {
      throwOnError: false
    });
  }

  render() {
    return <span ref={this.myRef} />;
  }
}

class THC extends Component {
  render() {
    return ( 
        <div className='content'>
          <Title title={this.props.title} date={this.props.date} cat={this.props.cat} />
          <div><b>Description.</b> We're given a textbook ElGamal signature scheme with seemingly no implementation mistakes.</div>
          <Code>
            {chall2}
          </Code>
          <div className='space'>
            <b>Solution. </b>Recall that an ElGamal signature on the hash <L1>h</L1> of a message <L1>m</L1> consists of the two numbers <L1>r</L1> and <L1>s</L1> as defined below.
          </div>
          <div className='center-eq'>
            <L1>{eq1}</L1>
          </div>
          <div className='space'>
            Here <L1>g</L1> and <L1>p</L1> are public parameters, <L1>x</L1> is a number such that <L1>y = g^x \pmod p</L1> (and <L1>y</L1> is known), and <L1>k</L1> is secret. Given <L1>y</L1>, it is <a href='https://en.wikipedia.org/wiki/Discrete_logarithm'>believed to be hard</a> to retrieve <L1>x</L1>, and with out <L1>x</L1> it is hard to forge a value of <L1>s</L1> and <L1>r</L1>.
          </div>
          <div className='space'>
            As it turns out, there is a <a href=''>paper</a> that shows that it is easy to forge signatures if the generator <L1>g</L1> is weak. In this writeup, I basically reformulate page 3 of that paper. I found the corollary the most natural place to start, so let's consider what happens when <L1>{m3}</L1>.
          </div>
          <div className='center-eq'>
            <L1>{m4}</L1>
          </div>
          <div>
            It wasn't obvious to me how <L1>{m5}</L1> reduced to <L1>(p - 1) \pmod p</L1> in the fourth equation, so I've explained that in the <a href='#appendix'>Appendix</a>. Ultimately, the catastrophe is that <L1>g</L1> ended up in the denominator, and the irony is that <L1>g</L1> is 2 in our case and <L1>{m25}</L1> because <L1>p</L1> is a "safe prime"! So what happens when <L1>r = q</L1>? Let's see recall how verification happens.
          </div>
          <div className='center-eq'>
            <L1>{m6}</L1>
          </div>
          <div>
            We do not know <L1>x</L1>, so we cannot calculate <L1>{m7}</L1>. But when <L1>r = q</L1>, <L1>{m8}</L1>, and so, depending on whether <L1>x</L1> is odd or even, it can take only one of two values (<L1>\pm 1</L1>). In either case, the bottom line is that we no longer need <L1>x</L1> to calculate <L1>S</L1>: We can just replace <L1>{m9}</L1> with <L1>{m10}</L1> and the values wouldn't differ. The multiplier <L1>z</L1> depends on the LSB of <L1>x</L1> and we'll get to that later, but for now let's focus on calculating the other variable, <L1>{m11}</L1>.
          </div>
          <div className='space'>
            First, note that <L1>p \equiv 3 \pmod 4</L1>, so <L1>{m12}</L1> is even just like <L1>p - 1</L1>. This means that <L1>k</L1> and <L1>p - 1</L1> are not coprime, and thus <L1>k</L1> is not invertible. However, if the GCD of <L1>k</L1> and <L1>p - 1</L1> is <L1>f</L1>, then there exists some <L1>{m13}</L1> such that <L1>{m14}</L1>. Now, if <L1>{m15}</L1> the the <L1>r^s</L1> part will be calculated as follows.
          </div>
          <div className='center-eq'>
            <L1>{m16}</L1>
          </div>
          <div>
            As you can see, that <L1>f</L1> is going to mess things up. So all we need to do, then, is to divide <L1>(h - zq)</L1> by <L1>f</L1> and our forgery will be complete. However, the crucial thing is that <L1>(h - zq)</L1> <i>must</i> be divisible by <L1>f</L1> to remain an integer. But because <L1>p = 3 \pmod 4</L1>, the GCD <L1>f</L1> is 2 (<a href='appendix2'>Why?</a>), which means that <L1>(h - zq)</L1> will be divisible!
          </div>
          <div className='space'>
            So now the only thing left to find is that <L1>z</L1>. Earlier I mentioned that we can safely replace <L1>{m9}</L1> with <L1>{m10}</L1>, and depending on the LSB of <L1>x</L1>, <L1>{m17}</L1>. But our forged value <L1>g^q \pmod p</L1>, on the hand, is always -1. So if the actual <L1>{m18}</L1> were 1, we set <L1>z = 2</L1> so that <L1>{m19}</L1>, for example. Apologies for labouring the point, but it took me quite a while to understand this part. Anyways, if you plug all of that into code, you get the flag.
          </div>
          <Code>
            {sol1}
          </Code>
          <div id='appendix'>
            <b>Appendix. </b>Why is <L1>{m20}</L1>? First, Recall that if <L1>g</L1> is the generator of <L1>{m21}</L1> (the ring of integers modulo <L1>p</L1>), this means that <L1>g</L1> generates every element in <L1>{m21}</L1>. In other words, its order is <L1>p - 1</L1> (because it has <L1>p - 1</L1> elements), and equivalently, <L1>p - 1</L1> is the smallest number such that <L1>{m22}</L1>.
          </div>
          <div className='space'>
            Now, by Euler's criterion, <L1>{m20}</L1> can take only one of two values (<L1>\pm 1</L1>). If it were <L1>1</L1>, then this implies that <L1>{m23}</L1>, and not <L1>p - 1</L1> is the order of the group. But then this would mean that the group's order is less than <L1>p - 1</L1>, implying that <L1>g</L1> didn't generate all the elements of the group, thus contradicting our assumption about <L1>g</L1>. Thus the only value <L1>{m24}</L1> can take is <L1>-1</L1>.
          </div>

          <div id='appendix2' class='space'>
            Why is 2 the GCD of <L1>p - 1</L1> and <L1>{m12}</L1> when <L1>p \equiv 3 \pmod 4</L1>? <L1>p \equiv 3 \pmod 4</L1> implies that we have some <L1>k_1</L1> and <L1>k2</L1> such that:
          </div>
          <div className='center-eq'>
            <L1>{m26}</L1>
          </div>
          <div>
            So, the GCD of <L1>p - 1</L1>, <L1>{m12}</L1> <L1>=</L1> GCD of <L1>4y_1 + 2, 2y_1</L1> <L1>=</L1> GCD of <L1>2(2y_1 + 1), 2y_1</L1>. 2 divides both those numbers, so it only remains to prove that <L1>2y_1 + 1</L1> and <L1>y_1</L1> are coprime. We can prove this by contradiction: If we assume that these numbers had a common factor <L1>X > 1</L1>, then there exits some <L1>z_1</L1> and <L1>z_2</L1> such that:
          </div>
          <div className='center-eq'>
            <L1>{m27}</L1>
          </div>
          <div className='space'>
            Clearly, the last equation cannot be true as the product of two numbers greater than 1 cannot be 1. Hence, our assumption is wrong and 2 is the only (and thus, greatest) factor. 
          </div>
          <div>&nbsp;</div>
        </div>
    );
  }
}

export default THC;

