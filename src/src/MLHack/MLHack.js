import React, { Component } from 'react';
import Code from '../CodeBlock';
import Tex from '../Tex';
import Title from '../Title';
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const t1 = 'Y';
const t2 = `\\begin{aligned}
Z &= [z_1, z_2, z_3] = [3, 10, 20] \\\\
Y &= [y_1, y_2, y_3] = [4, 8, 17]
\\end{aligned}`;
const t4 = `\\begin{aligned}
RMSE &= \\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(z_i-y_j)^2} \\\\[16pt]
     &= \\sqrt{\\frac{1}{3}((3 - 4)^2 + (10 - 8)^2 + (20 - 17)^2)} \\\\[12pt]
     &= 2.16
\\end{aligned}`;
const t5 = 'Y = [4, 9, 19]';

const t6 = `\\begin{aligned}
RMSE &= \\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(z_i-0)^2} \\\\
RMSE^2 &= \\frac{1}{n}\\sum_{i=1}^{n}z_i^2 \\\\
n RMSE^2 &= \\sum_{i=i}^{n}z_i^2
\\end{aligned}`;

const t7 = `\\begin{aligned}
n RMSE_1^2 &= x_0^2 + x_1^2 + ... + x_n^2 \\\\[4pt]
n RMSE_2^2 &= (x_0 - 1)^2 + x_1^2 + ... + x_n^2
\\end{aligned}`;

const t8 = `\\begin{aligned}
n (RMSE_1^2 - RMSE_2^2) &= x_0^2 - (x_0 - 1)^2 \\\\[4pt]
n (RMSE_1^2 - RMSE_2^2) &= x_0^2 - x_0^2 + 2x_0 - 1 \\\\[4pt]
\\dfrac{n (RMSE_1^2 - RMSE_2^2) + 1}{2} &= x_0 \\\\
\\end{aligned}`;

const c1 = `import numpy as np
Z = np.array([3, 10, 20])
Y = np.array([4, 8, 17])
rmse = np.sqrt(np.mean(np.square(Z - Y)))`

const c2 = `from random import randint
import numpy as np

ln = 7000

nums = [randint(1, 200) for i in range(ln)]

def get_rmse(a):
    return np.sqrt(np.mean(a ** 2))

rmse = get_rmse(np.array(nums))
preds = np.array([0 for _ in range(ln)])
sol = []

for i in range(ln):
    r1 = get_rmse(preds - nums)

    p2 = np.append(preds[:i], [preds[i] + 1])
    p2 = np.append(p2, preds[i + 1:])

    r2 = get_rmse(p2 - nums)

    sol.append(round(r1 ** 2 * ln - r2 ** 2 * ln + 1) // 2)

assert(sol == nums)`

class MLHack extends Component {
  render() {
    return (
        <div className='content'>
          <Title title={this.props.title} date={this.props.date} cat={this.props.cat} />
          <p>
          This week, while playing <a href="https://datahack.analyticsvidhya.com/contest/job-a-thon-april-2022">Analytics Vidhya's Jobathon</a>, an ML hackathon, I stumbled upon a way to "hack" the public leaderboard and climb to the top of the rankings.
         </p>
         <p>Some background about ML hackathons: In these events, the idea is to build a machine learning model is trained on some input data (provided by the organizers) and is then used to make some predictions on some test data (again, provided by the organizers). These predictions are compared with the actual values using some sort of evaluation metric (typically, the RMSE or Root Mean Squared Error), and the models are ranked in a public leaderboard sorted by the metric in ascending order.
          </p>
          <p>For example, in this event, the input data and test data were the hourly sales of a car shop. Let's say the hourly test data (<Tex>Z</Tex>), in some currency unit, and our predictions (<Tex>{t1}</Tex>) were the following:
          </p>
          <div class='center-eq'>
              <Tex>{t2}</Tex>
          </div>
          <p>Then the RMSE for our predictions will be calculated as follows:</p>
          <div className='center-eq'>
            <Tex>{t4}</Tex>
          </div>
          <Code>
            {c1}
          </Code>
          <p>Some other model that predicted, say, <Tex>{t5}</Tex> would have a much lower RMSE of 1.0 and thus rank much higher in the leaderboard. Of course, if we knew what the test data was, we could just get send that as our predictions and get an RMSE of 0. Is there some way to leak the test data, though?
          </p>
          <p>First, note that the event platform is essentially a scoring oracle. We can send it a list of numbers and it will return to us the RMSE score of those numbers when compared with the test data. Second, and specifically for this particular event's test data, the actual test data are all integers. Finally, the platform does not limit or rate-limit requests: We are free to send as many requests as we want, and as frequently as we want. Now, observe the RMSE value that is returned when we send predictions of all zeroes to the server:
          </p>
          <div className='center-eq'>
              <Tex>{t6}</Tex>
          </div>
          <p>In other words, we're looking for a bunch of <Tex>n</Tex> squares that add up to <Tex>n RMSE^2</Tex>. This looked to me like an extension of a <a href="https://leetcode.com/problems/perfect-squares/">leetcode dynamic programming problem</a>, however it turns out that the problem is intractable for large values of <Tex>n</Tex> (~7000, in our case). Another approach would be to increment each <Tex>y_i</Tex> by, say, 20 units, as long as the RMSE returned from the server  drops. However, this would require about about 5 queries per variable (assuming that the mean of the test data is about 100), resulting in a total of <Tex>~7000 \times 5</Tex> queries, which is a bit too much. There is, however, a slightly more efficient approach.
          </p>
          <p>First, send a list of all-zero predictions as before. Next, set the first prediction to be 1 and send the predictions to the server (like a one-hot encoding: a single 1 followed by <Tex>n - 1</Tex> zeroes). Here are the RMSEs returned by the server:
          </p>
          <div className='center-eq'>
            <Tex>{t7}</Tex>
          </div>
          <p>Subtracting the two equations, we get:</p>
          <div className='center-eq'>
            <Tex>{t8}</Tex>
          </div>
          <p>Since everything on the left is known, we can solve for <Tex>x_0</Tex>. To solve for any <Tex>x_n</Tex>, all we need to do is put a 1 in the appropriate index. For this competition, there were around 7000 predictions to make, and all we need is around 7000 queries to leak all of the test data and get an RMSE of 0. We can write a simple Selenium script in Python to automate the querying: Each request takes about 2 seconds, so we can recover all of the test data in about 4 hours. Of course, I didn't actually do this as I didn't want to ruin the competition for everyone else, but here's a simple POC of the side-channel attack locally:
          </p>
          <Code>{c2}</Code>
          <div>&nbsp;</div>
        </div>
    );
  }
}

export default MLHack;
