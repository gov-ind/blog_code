import React, { useState } from 'react';
import Code from '../../CodeBlock';
import Title from '../../Title';
import Tex from '../../Tex';
import AppTextField from '../../components/AppTextField';
import AppButton from '../../components/AppButton';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend
);

const options = {
    plugins: {
        legend: {
            display: false
        },
    },
    scales: {
      x: {
        ticks: {
          beginAtZero: true
        },
        stacked: true,
        grid: {
            display: false
        }
      },
      y: {
        ticks: {
          beginAtZero: true,
          stepSize: 0.1
        },
        stacked: false,
      }
    },
    barPercentage: 1,
    categoryPercentage: 1,
};

const ChartComponent = ({ labels, data1, data2 }) => {
    const data = {
        labels,
        datasets: [
          {
            label: 'P',
            data: data1,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
          },
          {
            label: 'Q',
            data: data2,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      }
  
    return (
        <Bar options={options} data={data} />
    );
};

const abs = n => n < 0 ? -n : n;

function calculateCumulativeDistribution(arr1, arr2) {
    const uniqueValues = [...new Set([...arr1, ...arr2])].sort((a, b) => a - b);
    const cdf1 = uniqueValues.map(u => arr1.map(a => a <= u).filter(Boolean).length / arr1.length)
    const cdf2 = uniqueValues.map(u => arr2.map(a => a <= u).filter(Boolean).length / arr2.length)
    
    return [uniqueValues, cdf1, cdf2];
}

function calculateWorkDoneArray(originalNums1, nums1, originalNums2, nums2) {
  const n = Math.max(originalNums1.length, originalNums2.length);
  let workDoneArray = [];
  let workDone = 0;

  if (originalNums1.length !== nums1.length) {
    return 'N/A. The modified P\'s length doesn\'t match with the original P';
  }
  if (originalNums2.length !== nums2.length) {
    return 'N/A. The modified Q\'s length doesn\'t match with the original Q';
  }

  for (let i = 0; i < n; i++) {
    let diff = 0
    if (i < originalNums1.length) {
      diff += abs(originalNums1[i] - nums1[i])
    }
    if (i < originalNums2.length) {
      diff += abs(originalNums2[i] - nums2[i])
    }
    workDoneArray.push(diff);
    if (i < n - 1) {
      workDoneArray.push('+');
    }
    workDone += diff;
  }

  workDone /= n;

  return '(' + workDoneArray.join(' ') + ') / ' + n + ' = ' + workDone;
}

const eq1 = 'W = \\sum\\limits_{i=1}^{n} \\delta \\cdot p_i';
const eq2 = 'i_{th}';
const eq3 = 'WD_{(P, Q)} = \\dfrac{1}{n}\\sum\\limits_{i=1}^{n} |P_i - Q_i|';

const code1 = `from scipy.stats import wasserstein_distance
assert wasserstein_distance([1, 3, 4, 5], [1, 3, 5]) == 1 / 6 + 1 / 6 +  1 / 12`

const Wasserstein = props => {
    const [originalNums1, setOriginalNums1] = useState([1, 6, 6, 10]);
    const [originalNums2, setOriginalNums2] = useState([4, 4, 9, 12]);
    const [nums1Str, setNums1Str] = useState('1, 6, 6, 10');
    const [nums1, setNums1] = useState([1, 6, 6, 10]);
    const [nums2Str, setNums2Str] = useState('4, 4, 9, 12');
    const [nums2, setNums2] = useState([4, 4, 9, 12]);

    const [values, cdf1, cdf2] = calculateCumulativeDistribution(nums1, nums2);
    const workDoneArray = calculateWorkDoneArray(originalNums1, nums1, originalNums2, nums2);

    const split1 = e => {
        const s = e.target.value;
        setNums1Str(s);
        try {
            const n = s.split(', ').map(a => parseInt(a, 10)).filter(a => !Number.isNaN(a));
            setNums1(n);
        } catch (e) {}
    };
    const split2 = e => {
        const s = e.target.value;
        setNums2Str(s);
        try {
            const n = s.split(', ').map(a => parseInt(a, 10)).filter(a => !Number.isNaN(a));
            setNums2(n);
        } catch (e) {}
    };
    const reset = () => {
      setOriginalNums1(nums1);
      setOriginalNums2(nums2);
    }

    return (      
        <div className='content'>
          <Title title={props.title} date={props.date} cat={props.cat} />
          <p>
            The Wasserstein distance, a metric that measures the distance between two probability distributions, is, amongst other things, a two-sample test that I've found useful to detect data drift. In this blog post, we'll interactively demystify this distance with minimal math.
          </p>
          <p>
            Recall that a two-sample test determines whether two data distributions are "statistically different". In machine learning, one application of this test is to tell whether a (newer) sample of data, the current data, <span className='code-block'>P</span> has "drifted" from an other (older) sample, the reference data, <span className='code-block'>Q</span>. The typical drift-detection process is as follows.<br></br><br></br>
            1. If the data samples are high-dimensional, compress each of them to a low-dimensional vector using, say, Principal Component Analysis (PCA) or autoencoders.<br></br>
            2. Convert each compressed data sample to a cumulative probability distribution (CDF) and calculate the statistical distance of your choice between each CDF.
          </p>
          <p className='m-b-2'>
            For this illustration, we'll pick one-dimensional vectors so that we don't need step 1, compression. Our choices, <span className='code-block'>P = [1, 6, 6, 10]</span> and <span className='code-block'>Q = [4, 4, 9, 12]</span>, are converted to CDFs and plotted below.
          </p>
          <ChartComponent
            labels={values}
            data1={cdf1}
            data2={cdf2}
          />
          <div className='row m-t-1'>
            <AppTextField 
              label="Enter the numbers in P"
              onChange={split1}
              value={nums1Str}
            />
            <AppTextField 
              label="Enter the numbers in Q"
              onChange={split2}
              value={nums2Str}
              className='m-l-1'
            />
            <AppButton onClick={reset}>Reset</AppButton>
          </div>
          <div>
            Work done = {workDoneArray}
          </div>
          <p className='m-t-2'>
            The Wasserstein distance can be thought of as the average amount of work to be done to make the CDFs of the two samples equal. In the demo above, try changing each value of <span className='code-block'>Q</span> and observe how the work done is calculated for each change. When the CDF of <span className='code-block'>Q</span> is identical to <span className='code-block'>P</span>, the work done is simply the Wasserstein distance. If you wish to play around with some other choices of <span className='code-block'>P</span> and <span className='code-block'>Q</span>, click "Reset" after you've made your changes. For now though, we'll stick to the equal-length sorted arrays mentioned previously.
          </p>
          <p>
            Here's what's happening in the "Work done" section below the textboxes: For each element of the array, the average work done is the absolute value of the change made to that element multiplied by the proportion of elements changed (when we change only one element, the proportion is always <Tex>1/4</Tex>). The <i>total</i> average work done, <Tex>W</Tex>, is the sum of the average work done for each element, and can be expressed as the following equation. When the two CDFs align perfectly, the work done is the Wasserstein distance between <span className='code-block'>P</span> and <span className='code-block'>Q</span>.
          </p>
          <Tex>{eq1}</Tex>
          <p>
            Where <Tex>n</Tex> is the total number of elements in each array, <Tex>\delta</Tex> is the change made to the <Tex>{eq2}</Tex> element, and <Tex>p_i</Tex> is the proportion of elements changed in the <Tex>{eq2}</Tex> percentile (which is always <Tex>1 / n</Tex> here because the arrays are of equal length and have unique values). There are infinitely many changes that can make the two CDFs equal, but the simplest one is to simply make <span className='code-block'>P</span> equal to <span className='code-block'>Q</span>. The average work done for this would be <Tex>((4 - 1) + (6 - 4) + (9 - 6) + (12 - 10)) / 4 = 2.5</Tex>, which is the Wasserstein distance between the <span className='code-block'>P</span> and <span className='code-block'>Q</span>.
          </p>
          <p>
            There are a couple of things to note here. What we've done so far only applies when the two arrays have the same number of elements. In such cases, the CDFs can be the same only when the two arrays are exactly the same. Secondly, because we're looking for the <i>minimum</i> work done, the arrays must be sorted so that the elements being compared and changed are as close to each other as possible and in the correct percentile. Given these assumptions, the formula for the work done <Tex>W</Tex>, or equivalently, the Wasserstein distance, <Tex>WD</Tex> between two sorted equal-length arrays <span className='code-block'>P</span> and <span className='code-block'>Q</span> is as follows.
          </p>
          <Tex>{eq3}</Tex>
          <p>
            What if the arrays are not of the same length? Let's consider <span className='code-block'>P = [1, 3, 4, 5]</span> and <span className='code-block'>Q = [1, 3, 5]</span>. <span className='code-block'>P</span> has <Tex>1/4</Tex> of its values less than or equal to 1, while <span className='code-block'>Q</span> has <Tex>1/3</Tex> of its values less than or equal to 1, so there seems to be no way to flip any value in either array to make the percentile value the same.
          </p>
          <p>
            The trick is to modify <span className='code-block'>Q</span> such that we can make 1's percentile equal to <Tex>1/4</Tex>. We can do this be duplicating each element in <span className='code-block'>Q</span> four (the length of <span className='code-block'>P</span>) times to get <span className='code-block'>[1, 1, 1, 1, 3, 3, 3, 3, 5, 5, 5, 5]</span>. Note that this <span className='code-block'>Q</span>'s length is the Least Common Multiple (LCM) of <span className='code-block'>P</span> and <span className='code-block'>Q</span>'s lengths, so it's now possible to make 1's percentile <Tex>1/4</Tex>. Also, simply duplicating each element in <span className='code-block'>Q</span> does not change its CDF, so our modification is valid. Here's the two arrays after the modification.
          </p>
          <p className='box'>
            P = [1, 3, 4, 5]<br/>
            Q = [1, 1, 1, 1, 3, 3, 3, 3, 5, 5, 5, 5]<br/>
          </p>
          <p>
            Currently, 1's percentile for <span className='code-block'>Q</span> is <Tex>4/12 = 1/3</Tex>. By flipping one of the four 1s, we can bring 1's percentile down to <Tex>3/12 = 1/4</Tex>. Let's flip one out of the twelve elements from a 1 to a 3 (the next percentile), resulting in a total average work of <Tex>(3 - 1)/12 = 1/6</Tex> 
          </p>
          <p className='box'>
            P = [1, 3, 4, 5]<br/>
            Q = [1, 1, 1, 3, 3, 3, 3, 3, 5, 5, 5, 5]<br/>
            Work done: 1/6
          </p>
          <p>
            Next, let's bring 3's proportion (<Tex>5/12</Tex>) down to <Tex>1/4</Tex> by flipping two 3s to a 4. The total average work done for this operation is <Tex>(4 - 3)/12 + (4 - 3)/12 = 1/6</Tex>.
          </p>
          <p className='box'>
            P = [1, 3, 4, 5]<br/>
            Q = [1, 1, 1, 3, 3, 3, 4, 4, 5, 5, 5, 5]<br/>
            Work done: 1/6 + 1/6
          </p>
          <p>
            Finally, let's bring 4's proportion (<Tex>2/12</Tex>) up to <Tex>1/4</Tex> by flipping one 4 to a 5 (making 5's proportion <Tex>1/4</Tex> at the same time). The total average work done for this operation is <Tex>(5 - 4)/12 = 1/12</Tex>.
          </p>
          <p className='box'>
            P = [1, 3, 4, 5]<br/>
            Q = [1, 1, 1, 3, 3, 3, 4, 4, 4, 5, 5, 5]<br/>
            Work done: 1/6 + 1/6 + 1/12
          </p>
          <p>
            The total work done to make the CDFs of <span className='code-block'>P</span> and <span className='code-block'>Q</span> identical was <Tex>1/6 + 1/6 + 1/12 = 5/12</Tex>, and this can be verified using <span className='code-block'>scipy</span>.
          </p>
          <Code>
            {code1}
          </Code>
          <p>
            <b>Conclusion.</b> I hope this post provided a simplified explanation of how the Wasserstein distance works. Of course, you wouldn't want to implement or use the algorithm presented above as it won't be memory-efficient or parallelizable, but it definitely provides some intuition about what the metric is actually doing.
          </p>
          <p>&nbsp;</p>
        </div>
    );
};

export default Wasserstein;