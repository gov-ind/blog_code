import React, { Component } from "react";
import Tex from "../components/Tex";
import MathJax from "react-mathjax2";
import Code from "../components/CodeBlock";
import ReactMarkdown from "react-markdown";
import Title from "../components/Title";
import fig1 from "./fig1.png";
import fig2 from "./fig2.png";
import fig3 from "./fig3.png";
import fig4 from "./fig4.png";
import fig5 from "./fig5.png";

const code1 = `# Copyright 2022 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import numpy as np
import sys
import glob
import string
import tensorflow as tf
from keras.models import Sequential
from keras.layers.core import Dense, Flatten
from flag import flag
import signal

signal.alarm(120)

tf.compat.v1.disable_eager_execution()

image_data = []
for f in sorted(glob.glob("images/*.png")):
    im = tf.keras.preprocessing.image.load_img(
        f, grayscale=False, color_mode="rgb", target_size=None, interpolation="nearest"
    )
    im = tf.keras.preprocessing.image.img_to_array(im)
    im = im.astype("float32") / 255
    image_data.append(im)

image_data = np.array(image_data, "float32")

# The network is pretty tiny, as it has to run on a potato.
model = Sequential()
model.add(Flatten(input_shape=(16,16,3)))
# I'm sure we can compress it all down to four numbers.
model.add(Dense(4, activation='relu'))
model.add(Dense(128, activation='softmax'))

print("Train this neural network so it can read text!")

wt = model.get_weights()
while True:
    print("Menu:")
    print("0. Clear weights")
    print("1. Set weight")
    print("2. Read flag")
    print("3. Quit")
    inp = int(input())
    if inp == 0:
        wt[0].fill(0)
        wt[1].fill(0)
        wt[2].fill(0)
        wt[3].fill(0)
        model.set_weights(wt)
    elif inp == 1:
        print("Type layer index, weight index(es), and weight value:")
        inp = input().split()
        value = float(inp[-1])
        idx = [int(c) for c in inp[:-1]]
        wt[idx[0]][tuple(idx[1:])] = value
        model.set_weights(wt)
    elif inp == 2:
        results = model.predict(image_data)
        s = ""
        for row in results:
            k = "?"
            for i, v in enumerate(row):
                if v > 0.5:
                    k = chr(i)
            s += k
        print("The neural network sees:", repr(s))
        if s == flag:
            print("And that is the correct flag!")
    else:
        break
`;

const code2 = `import numpy as np

input = np.array([[1, 2]])

weight1 = np.random.randn(2, 4)
weight2 = np.random.randn(4, 6)

# Layer 1
output_layer1_before_activation = np.squeeze(input).dot(weight1) 
# ReLU
output_layer1 = np.maximum(output_layer1_before_activation, 0)

# Layer 2
output_layer2_before_activation = output_layer1.dot(weight2)
#softmax
preds = (
  np.exp(output_layer2_before_activation) /
  np.exp(output_layer2_before_activation).sum()
)

print(f'Preds np: {preds}')

import tensorflow as tf

model = tf.keras.models.Sequential()
model.add(tf.keras.Input(shape=(2,)))
model.add(tf.keras.layers.Dense(4, activation='relu'))
model.add(tf.keras.layers.Dense(6, activation='softmax'))

wt = model.get_weights()
wt[0] = weight1
# wt[1] is the bias of the first layer
wt[2] = weight2
# wt[3] is the bias of the second layer

model.set_weights(wt)

print(f'Preds tf: {model.predict(input)}')`;

const code3 = `# The network is pretty tiny, as it has to run on a potato.
model = Sequential()
model.add(Flatten(input_shape=(16,16,3)))
# I'm sure we can compress it all down to four numbers.
model.add(Dense(4, activation='relu'))
model.add(Dense(128, activation='softmax'))`;

const m1 = `\\underset{1 \\times c}{\\mathrm{Z}} = \\underbrace{\\underset{1 \\times d}{\\mathrm{X}} \\times \\underset{d \\times h}{\\mathrm{W_1}}}_{Layer 1} \\times \\underbrace{\\underset{h \\times c}{\\mathrm{W_2}}}_{Layer 2}`;

const Z = "\\mathrm{Z}";
const X = "\\mathrm{X}";
const W1 = "\\mathrm{W_1}";
const W2 = "\\mathrm{W_2}";

const m2 = `\\begin{aligned}
\\mathrm{Z} &=
\\underbrace{\\begin{bmatrix}
    x_{0} & x_{1} & x_{2} \\\\
\\end{bmatrix}
\\times
\\begin{bmatrix}
    1       & 0   \\\\
    0       & 0   \\\\
    0       & 0
\\end{bmatrix}
}_{Layer 1}
\\times
\\underbrace{\\begin{bmatrix}
    w  & 0 & 0  \\\\
    0       & 0 & 0  \\\\
\\end{bmatrix}
}_{Layer 2} \\\\
&=
\\underbrace{
\\begin{bmatrix}
    x_{0}       & 0   \\\\
\\end{bmatrix}
}_{Layer 1}
\\times
\\underbrace{\\begin{bmatrix}
    w  & 0 & 0  \\\\
    0       & 0 & 0  \\\\
\\end{bmatrix}
}_{Layer 2} \\\\
&=
\\begin{bmatrix}
    x_{0} \\cdot w & 0  & 0 \\\\
\\end{bmatrix}
\\end{aligned}`;

const m3 = `\\begin{aligned}
\\sigma(z_i) &= \\frac{e^{z_i}}{\\sum_{i=0}^{i=c - 1}e^{z_i}}
\\end{aligned}`;

const m4 = `\\begin{aligned}
\\sigma(z_0) &= \\frac{e^{z_0}}{e^{z_0} + e^{z_1} + e^{z_2}} \\\\
             &= \\frac{e^{x_0 \\cdot w}}{e^{x_0 \\cdot w} + e^{0} + e^{0}}
\\end{aligned}`;

const m5 = `\\begin{aligned}
e^{x_0 \\cdot w} &= \\frac{2 \\cdot \\sigma(z_0)}{1 - \\sigma(z_0)} \\\\
x_0 &= \\frac{1}{w} \\ln{(\\frac{2 \\cdot \\sigma(z_0)}{1 - \\sigma(z_0)})}
\\end{aligned}`;

const soft = "\\sigma(z_0)";
const soft1 = "\\sigma(z_0) \\ge 0.5";
const soft2 = "\\sigma(z_0) \\approx 0.5";

const m6 = "x_0 \\approx \\frac{\\ln{(2)}}{w}";
const m7 = "\\frac{\\ln(c - 1)}{w}";
const m8 = "x_0 \\approx \\frac{\\ln(127)}{w}";

const code4 = `import glob
import numpy as np
import tensorflow as tf
from keras.models import Sequential
from keras.layers.core import Dense, Flatten
from math import log

tf.compat.v1.disable_eager_execution()

image_data = []
for f in sorted(glob.glob("images/*.png")):
    im = tf.keras.preprocessing.image.load_img(
        f, grayscale=False, color_mode="rgb", target_size=None, interpolation="nearest"
    )
    im = tf.keras.preprocessing.image.img_to_array(im)
    im = im.astype("float32") / 255
    image_data.append(im)

image_data = np.array(image_data, "float32")

model = Sequential()
model.add(Flatten(input_shape=(16, 16, 3)))
model.add(Dense(4, activation='relu'))
model.add(Dense(128, activation='softmax'))

wt = model.get_weights()

wt[0].fill(0)
wt[1].fill(0)
wt[2].fill(0)
wt[3].fill(0)

model.set_weights(wt)

wt[0][0][0] = 1

magic = log(127)
results = {}

for weight in np.linspace(magic, magic / 0.1, 50):
    wt[2][0][0] = weight

    result = model.predict(image_data)
    
    s = ""
    for row in result:
        k = "?"
        for i, v in enumerate(row):
            if v > 0.5:
                k = chr(i)
        s += k

    results[magic / weight] = s

for pixel in results:
    value = ''.join([str(a.encode())[2:-1].ljust(6) for a in results[pixel]])
    print(f'Pixel {"%.2f"%pixel.round(2)}: {value}')

keys = list(results.keys())

for i in range(4):
    try:
        pred = keys[[a[i] for a in results.values()].index('\x00')]
    except:
        pred = 0

    print(f'Pixel {i} error: {image_data[i][0][0][0] - pred}')`;

const code5 = `import glob
import numpy as np
from math import log
from matplotlib import pyplot as plt
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Flatten, Dense

tf.compat.v1.disable_eager_execution()

image_data = []
for f in sorted(glob.glob("images/*.png")):
    im = tf.keras.preprocessing.image.load_img(
        f, grayscale=False, color_mode="rgb", target_size=None, interpolation="nearest"
    )
    im = tf.keras.preprocessing.image.img_to_array(im)
    im = im.astype("float32") / 255
    image_data.append(im)

image_data = np.array(image_data, "float32")

model = Sequential()
model.add(Flatten(input_shape=(16, 16, 3)))
model.add(Dense(4, activation='relu'))
model.add(Dense(128, activation='softmax'))

wt = model.get_weights()

wt[0].fill(0)
wt[1].fill(0)
wt[2].fill(0)
wt[3].fill(0)

model.set_weights(wt)

results = {}

magic = log(127)
num_samples = 10
weights = np.linspace(magic, magic / 0.1, num_samples)
num_pixels = 768

for pixel in range(num_pixels):
    print(f'Pixel: {pixel}')
    results[pixel] = {}
    wt[0][pixel][0] = 1

    for weight in weights:
        wt[2][0][0] = weight
        
        result = model.predict(image_data)
    
        s = ""
        for row in result:
            k = "?"
            for i, v in enumerate(row):
                if v > 0.5:
                    k = chr(i)
            s += k

        results[pixel][magic / weight] = s

    wt[0].fill(0)

num_chars = len(list(results[0].values())[0])

sols = np.zeros((num_chars, num_pixels))

for char in range(num_chars):
    for pixel in results:
        for weight in results[pixel]:
            if results[pixel][weight][char] == '\x00':
                sols[char][pixel] = weight
                break

plt.figure(figsize = (20, 3))
plt.imshow(np.hstack([sols[i].reshape((16, 16, 3)) for i in range(len(sols))]),
           interpolation='nearest')
plt.axis('off')
plt.savefig('solution.png')

for char in range(num_chars):
    plt.imshow(sols[char].reshape((16, 16, 3)))
    plt.show()
    plt.clf()`;

const out1 = `Preds np: [0.0734868  0.01564227 0.00148961 0.59976645 0.025667   0.28394788]
Preds tf: [0.0734868  0.01564227 0.00148961 0.59976645 0.025667   0.28394788]`;

const out2 = `Pixel 1.00: ?     ?     ?     ?     
Pixel 0.84: ?     ?     ?     \\x00
Pixel 0.73: ?     \\x00  ?     \\x00  
Pixel 0.64: ?     \\x00  ?     \\x00  
Pixel 0.58: ?     \\x00  ?     \\x00  
Pixel 0.52: ?     \\x00  ?     \\x00  
Pixel 0.48: ?     \\x00  ?     \\x00  
Pixel 0.44: ?     \\x00  ?     \\x00  
Pixel 0.40: ?     \\x00  ?     \\x00  
Pixel 0.38: ?     \\x00  ?     \\x00  
Pixel 0.35: \\x00  \\x00  ?     \\x00  
Pixel 0.33: \\x00  \\x00  ?     \\x00  
Pixel 0.31: \\x00  \\x00  ?     \\x00  
Pixel 0.30: \\x00  \\x00  ?     \\x00`;

const ith = "i_{th}";

class OCR extends Component {
  render() {
    return (
      <div className="content">
        <Title
          title={this.props.title}
          date={this.props.date}
          cat={this.props.cat}
        />
        <p>
          <b>Description. </b>I solved a couple of misc challs at DUCTF this
          week (long after one of my awesome team mates at idek solved it first
          though), and thought of doing a quick writeup as these challenges kept
          me entertained throughout the weeked. The first one is an
          algorithm-style challenge which can actually be solved by some
          information theory.
        </p>
        <Code>{code1}</Code>
        <p>
          <b>Analysis. </b>The server selects three points (from a list of 24
          points), asks us to submit three points our guess, and returns some
          information about whether one of the points it selected lies in a
          square shaped perimeter around any of our guesses. Let's walk through
          an example to understand: Assume that the server selected the points
          (0, 0), (2, 0), and (4, 3) (marked with an X in the following image),
          and that we guessed (2, 3)
        </p>
        <p>
          In its simplest form, the function <Tex>f</Tex> is defined as follows:
          Take the input, multiply it by a matrix of weights, and optionally
          apply a nonlinear function to it. This sequence of operations
          constitutes a single “layer”, and a (deep) neural network may have
          many such layers. Let's create a simple two-layer neural network using
          numpy:
        </p>
        <Code>{code2}</Code>
        <pre className="box">{out1}</pre>
        <p>
          In this example, we have a 2 dimensional input that we wish to
          classify into 6 groups. Here, the first layer has a{" "}
          <Tex>2 \times 4</Tex> weight matrix followed by a nonlinear function (
          <a href="https://en.wikipedia.org/wiki/Rectifier_(neural_networks)">
            ReLU
          </a>
          ), and the second layer has a <Tex>4 \times 6</Tex> weight matrix
          followed by another nonlinear function (
          <a href="https://en.wikipedia.org/wiki/Softmax_function">softmax</a>).
        </p>
        <p>
          Due to the nature of the softmax function, the output coming out of it
          is a bunch of probabilities between 0 and 1. In this case, we see that
          the model thinks the sample has about a 60% chance of being the fourth
          class, which, of course, is probably quite wrong because the weights
          we chose were arbitrary. How, then, do we find the optimal set of
          weights? We do this by “training” the model using a technique called{" "}
          <a href="https://en.wikipedia.org/wiki/Backpropagation">
            backpropagation
          </a>
          , which uses calculus to find how to update the weights to reduce our
          prediction error. As it turns out, for this challenge, training the
          model is not required, so we don't need to worry too much about it.
        </p>
        <p>
          <b>Analysis. </b>Now let's look at the architecture of the neural net
          in the challenge:
        </p>
        <Code>{code3}</Code>
        <p>
          There are three layers: The first layer flattens the input of size{" "}
          <Tex>16 \times 16 \times 3</Tex> down to 768 pixels. The second layer
          compresses these 768 pixels down to 4 numbers before activating each
          through a ReLU function. The third layer expands the 4 numbers to 128
          numbers before passing them through to a softmax function.
        </p>
        <p>
          Ignoring the nonlinear functions and{" "}
          <a href="https://stackoverflow.com/questions/2480650/what-is-the-role-of-the-bias-in-neural-networks">
            biases
          </a>
          , let's abstractly write down the operations carried out in this
          network. Let's say we pass an input <Tex>{X}</Tex> with <Tex>d</Tex>{" "}
          dimensions to a network with a first layer <Tex>{W1}</Tex> with{" "}
          <Tex>h</Tex> dimensions and a second layer <Tex>{W2}</Tex> with{" "}
          <Tex>c</Tex> dimensions. Then we can write the output as the following
          sequence of matrix multiplications:
        </p>
        <p className="center-eq">
          <Tex>{m1}</Tex>
        </p>
        <p>
          Knowing that we control <Tex>{W1}</Tex> and <Tex>{W2}</Tex>, we have
          two options. One of them is to train the model locally to find the
          optimal weights that can detect text from images, send them to the
          server, and recover the text from the prediction <Tex>{Z}</Tex>. Let's
          look at the images of the first four characters provided to us to get
          an idea of what we have to train:
        </p>
        <p className="flex-center">
          <span className="image-wrapper-4">
            <img src={fig1} />
          </span>
          <span className="image-wrapper-4">
            <img src={fig2} />
          </span>
          <span className="image-wrapper-4">
            <img src={fig3} />
          </span>
          <span className="image-wrapper-4">
            <img src={fig4} />
          </span>
        </p>
        <p>
          There are a couple of issues here: First, we expect the neural net to
          be{" "}
          <a href="https://stats.stackexchange.com/questions/208936/what-is-translation-invariance-in-computer-vision-and-convolutional-neural-netwo">
            translationally invariant
          </a>{" "}
          because the images are not necessarily centered. However, the network
          itself seems to too simple to actually handle this. Second, we do not
          have access to enough training data that looks similar to the ones
          we've been provided. A dataset like{" "}
          <a href="https://en.wikipedia.org/wiki/MNIST_database">MNIST</a> might
          not generalize well enough, while generating some sort of synthetic
          dataset might be tedious.
        </p>
        <p>
          The second option is to craft some <Tex>{W1}</Tex> and <Tex>{W2}</Tex>{" "}
          and then use the returned prediction <Tex>{Z}</Tex> to recover the
          training data <Tex>X</Tex>. Let's unpack this with an example.
          Consider a <Tex>1 \times 3</Tex> input passed through a{" "}
          <Tex>3 \times 2</Tex> layer and a <Tex>2 \times 3</Tex> layer. For the
          first layer (<Tex>{W1}</Tex>), let's set all the weights to 0 except
          for the top-left weight, which we'll set to 1. For the second layer (
          <Tex>{W2}</Tex>), let's set all the weights to 0 except for the
          top-left weight, which we'll set to some <Tex>w</Tex>. Then, the
          output <Tex>{Z}</Tex> (before the softmax) for a single sample will be
          calculated as follows:
        </p>
        <p className="center-eq">
          <Tex>{m2}</Tex>
        </p>
        <p>
          Finally, the predicted probability is the softmax of <Tex>{Z}</Tex>:
        </p>
        <p className="center-eq">
          <Tex>{m3}</Tex>
        </p>
        <p>
          Now, let's focus on just the first pixel (<Tex>z_0</Tex>). The score
          for this pixel is:
        </p>
        <p className="center-eq">
          <Tex>{m4}</Tex>
        </p>
        <p>
          Rearranging this equation to get <Tex>x_0</Tex> to the left side and
          then taking the natural log on both sides, we have:
        </p>
        <p className="center-eq">
          <Tex>{m5}</Tex>
        </p>
        <p>
          Note that we know all the variables on the right side except for{" "}
          <Tex>{soft}</Tex>. However, we know that the server will set a{" "}
          <span className="code-block">?</span> at the zeroth index if{" "}
          <Tex>{soft1}</Tex>. This means that we can use the server as an
          oracle, querying it for different values of <Tex>w</Tex> in ascending
          order and observe when the character at the zeroth index changes from
          a <span className="code-block">?</span> to a null byte. For that
          weight, we know that <Tex>{soft2}</Tex>, and the above equation
          reduces to:
        </p>
        <p className="center-eq">
          <Tex>{m6}</Tex>
        </p>
        <p>
          More generally, for <Tex>c</Tex> output dimensions, the value of the
          input pixel will be <Tex>{m7}</Tex>. For our case, <Tex>c = 128</Tex>,
          so <Tex>{m8}</Tex>. Let's check if we can use this approach to leak
          the first pixel of each character:
        </p>
        <Code>{code4}</Code>
        <p>Here's a portion of the output:</p>
        <pre className="box">{out2}</pre>
        <p>
          We can see that the change from a{" "}
          <span className="code-block">?</span> to a null byte happens at the
          values 0.35, 0.73, and 0.84, which are approximately the values of the
          first pixels of the first, second, and fourth characters. All that
          remains, then, is to repeat this process to leak each of the other 767
          pixels (in my experience, leaking only 256 pixels, i.e. one of the
          three channels, was not enough to leak all the characters clearly).
          For this, we only need to modify the placement of the 1 in{" "}
          <Tex>{W1}</Tex>: To leak pixel <Tex>i</Tex>, we need to place the 1 in
          the <Tex>{ith}</Tex> row of the first column of <Tex>{W1}</Tex>.
        </p>
        <Code>{code5}</Code>
        <p>
          Here are the reconstructed characters. Although it is reasonably
          legible, we can obtain a more accurate leak by increasing{" "}
          <span className="code-block">num_samples</span>.
        </p>
        <div className="image-wrapper-4">
          <img src={fig5} />
        </div>
        <p>
          <a href="https://raw.githubusercontent.com/gov-ind/ctf_solves/main/2022/gctf/solve.py">
            Here's
          </a>{" "}
          the full script that delivers the parallelized version of the above
          exploit to the server.
        </p>
        <p>
          <b>Conclusion. </b>The solution presented here is extremely simple (it
          does not utilize the ReLU or the prediction of the softmax layer) and
          inefficient (it only leaks about one pixel per query). For a more
          advanced solution, check out{" "}
          <a href="https://imp.ress.me/blog/2022-07-05/google-ctf-2022-ocr/">
            this
          </a>{" "}
          excellent write-up.
        </p>
        <p>&nbsp;</p>
      </div>
    );
  }
}

export default OCR;
