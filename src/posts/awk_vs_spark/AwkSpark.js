import React, { Component } from "react";
import Code from "../../components/CodeBlock";
import Title from "../../components/Title";
import Tex from "../../components/Tex";
import partitions_map from "./partitions_map.png";
import partitions_groupby from "./partitions_groupby.png";
import partitions_groupby_salted from "./partitions_groupby_salted.png";
import partitions_groupby_salted_repart from "./partitions_groupby_salted_repart.png";
import partitions_big_rdd from "./partitions_big_rdd.png";
import partitions_small_rdd from "./partitions_small_rdd.png";
import partitions_salted_small_rdd from "./partitions_salted_small_rdd.png";

const code1 = `%pip install matplotlib==3.8.2 numpy==1.26.2 pandas==2.1.3 pyspark==3.5.0

from itertools import product
import multiprocessing
import os
import random

from matplotlib import pyplot as plt
import numpy as np
import pandas as pd
from pyspark import SparkConf, SparkContext

conf = SparkConf().setAppName("spark_vs_awk").setMaster("local[*]")
sc = SparkContext(conf=conf)`;

const code2 = `n_cores = multiprocessing.cpu_count()

def create_dict(values, group_names):
    out = {}
    for k, v in values:
        out[k] = len(v)
    for group_name in group_names:
        if group_name not in out:
            out[group_name] = 0
    return out

def get_group_partitions(rdd):
    group_names = rdd.map(lambda a: a[0]).distinct().collect()
    return rdd.glom().map(lambda a: create_dict(a, group_names)).collect()

def get_partitions(rdd):
    group_names = rdd.map(lambda a: a[0]).distinct().collect()
    return rdd.glom().map(lambda a: {k: len([aa for aa in a if aa[0] == k]) for k in group_names}).collect()

def plot(data, legend=True):
    df = pd.DataFrame(data)
    df = df.loc[(df != 0).any(axis=1)]
    n_cols = len(df.columns)
    df.columns = [f"Key {i}" for i in range(len(df.columns))]
    colors = ["#" + hex(int(a))[2:] for a in np.linspace(0x300, 0xa00, n_cols)]
    ax = df.plot(kind='bar', stacked=True, color=colors, width=1, edgecolor="black", position=0, legend=legend)
    ax.set_xlim(left=-.01)
    ax.set_xlim(right=n_cores)
    ax.set_xlabel("Partition number")
    ax.set_ylabel("Number of elements")`;

const code3 = `file_name = "data_big.csv"

if not os.path.exists(file_name):
    keys = [0] * 1 + [1] * 32000000
    vals = list(np.random.randint(0, 100, len(keys)))
    data = list(zip(keys, vals))
    random.shuffle(data)

    pd.DataFrame(data).to_csv(file_name, header=False, index=False)
    
rdd_raw = sc.textFile(file_name, n_cores)
rdd = rdd_raw.map(lambda a: a.split(",")).map(lambda a: (int(a[0]), (int(a[1]),)))`;

const code4 = `!time cat data_big.csv | wc -l
!time awk 'END { print NR }' data_big.csv`;

const code5 = `%timeit print(rdd.count())`;

const code6 = `rdd.persist()

%timeit print(rdd.count())`;

const code7 = `!time awk -F, '{ if ($2 % 2 == 0) { s += $2 ** 2 } } END { print s }' data_big.csv`;
const code8 = `%timeit print(rdd.filter(lambda a: a[1][0] % 2 == 0).map(lambda a: a[1][0] ** 2).sum())`;
const code9 = `%%bash
time awk -F, -e '
{
    groups[$1] += $2 * 2
}
END {
    for (g in groups) print g","groups[g]
}' data_big.csv`;
const code10 = `%timeit -r 1 print(rdd.groupByKey().map(lambda a: sum([aa[0] * 2 for aa in a[1]])).collect())`;
const code11 = `rdd_grouped = rdd.groupByKey()
plot(get_group_partitions(rdd_grouped))`;
const code12 = `%%timeit -r 1
print(rdd.reduceByKey(lambda a, b: (a[0] + b[0],)).map(lambda a: a[1][0] * 2).collect())`;
const code13 = `salt_max = n_cores - 1

def salt(a):
    return f"{a}_{random.randint(0, salt_max)}"

rdd_salted = rdd.map(lambda a: (salt(a[0]), a[1]))
plot(get_partitions(rdd_salted), legend=False)`;
const code14 = `%%timeit
results = {}

for result in rdd_salted.groupByKey().map(
    lambda a: (a[0], sum([aa[0] * 2 for aa in a[1]]))
).collect():
    k_, v = result
    k = k_.split("_")[0]
    if k not in results:
        results[k] = 0
    results[k] += v

print(results)`;
const code15 = `rdd_salted_repart = rdd_salted.partitionBy(n_cores, lambda a: int(a.split("_")[1]))
plot(get_partitions(rdd_salted_repart), legend=False)`;
const code16 = `%%timeit
results = {}

for result in rdd_salted_repart.groupByKey().map(
    lambda a: (a[0], sum([aa[0] * 2 for aa in a[1]]))
).collect():
    k_, v = result
    k = k_.split("_")[0]
    if k not in results:
        results[k] = 0
    results[k] += v

print(results)`;
const code17 = `file_name_to_join = "data_to_join.csv"

if not os.path.exists(file_name_to_join):
    keys = [2] * 1 + [1] * 8
    vals = list(np.random.randint(0, 100, len(keys)))
    data = list(zip(keys, vals))
    random.shuffle(data)

    pd.DataFrame(data).to_csv(file_name_to_join, header=False, index=False)`;
const code18 = `%%bash
time awk -F, -e '
NR == FNR {
    a[NR] = $1
    b[NR] = $2
    next
}
{
    for (k in a)
        if (a[k] == $1)
            print b[k]","$2
}' data_to_join.csv data_big.csv | awk -F, '{ s1 += $1; s2 += $2 } END { print s1","s2 }'`;
const code19 = `rdd_to_join_raw = sc.textFile(file_name_to_join)
rdd_to_join = rdd_to_join_raw.map(lambda a: a.split(",")).map(lambda a: (int(a[0]), int(a[1])))
rdd_flat = rdd.map(lambda a: (a[0], *a[1]))`;
const code20 = `rdd_joined = rdd_flat.join(rdd_to_join)
%timeit -r 1 print(rdd_joined.reduceByKey(lambda a, b: (a[0] + b[0], a[1] + b[1])).collect())`;
const code21 = `plot(get_partitions(rdd_flat))
plot(get_partitions(rdd_to_join))`;
const code22 = `rdd_to_join_salted = rdd_to_join.cartesian(
    sc.parallelize(range(n_cores))).map(lambda a: ((a[0][0], a[1]), a[0][1])
)
rdd_flat_salted = rdd_flat.map(lambda a: ((a[0], random.randint(0, n_cores - 1)), a[1]))
plot(get_partitions(rdd_to_join_salted), legend=False)
rdd_joined_salted = rdd_flat_salted.join(rdd_to_join_salted)`;
const code23 = `%%timeit -r 1

results = {}

for result in rdd_joined_salted.reduceByKey(lambda a, b: (a[0] + b[0], a[1] + b[1])).collect():
    k, _ = result[0]
    if k not in results:
        results[k] = [0, 0]
    results[k][0] += result[1][0]
    results[k][1] += result[1][1]

print(results)`;

const cmd1 = `{print s}`;

export default class extends Component {
  render() {
    return (
      <article className="content">
        <Title
          title={this.props.title}
          date={this.props.date}
          cat={this.props.cat}
        />
        <section>
          <p>
            In "Designing Data-Intensive Applications", Martin Kleppmann explored the idea of a high-performance toy database through the sequential chaining of fundamental Unix commands. Paolo Montesel also demonstrated something similar in a <a href="https://rev.ng/blog/bashml/post.html">blog post</a>, illustrating the creation of a Spark-style data processing pipeline using solely text files and Bash. The underlying principle is that Unix commands possess an inherently straightforward interface - reading input from stdin and outputting results to stdout - and can thus be (and are) easily parallelized.
          </p>
          <p>
            In this post, I want to see if the humble <span className="code-block">awk</span> command can take on the mighty Spark on a single node. It's well known that one can optimize Spark to process skewed data efficiently, but can <span className="code-block">awk</span> keep up? Let's find out.
          </p>
        </section>
        <section>
          <p>
            <b>Setup.</b> We'll start by installing some essential libraries and importing them. We'll also create a <span className="code-block">SparkContext</span> as we'll be dealing with RDDs, not DataFrames.
          </p>
          <Code>{code1}</Code>
          <p>
          Next, some utility functions to inspect the data in each Spark partition. The highlight here is Spark's <span className="code-block">glom</span> function, which aggregates together all the records in a partition. The <span className="code-block">get_group_partitions</span> function gets, for each partition, the number of records belonging to a group (this will be useful to visualize data skew).
          </p>
          <Code>{code2}</Code>
          <p>
          <b>The data.</b> Our skewed data is a simple key-value pair consisting of two keys, either 0 or 1, and a value ranging between 0 and 100. The data is skewed towards key 1, which has 32 million records (as opposed to the single record in key 0). In all we have 32000001 keys and 32000001 values, giving us a total of 64000002 integers. If each integer is packed as a long (even though it can be stored as a byte in our case), the total data size is <Tex>32000001 \cdot 2 \cdot 8 / (1024^2) \approx 488</Tex> MB, which isn't quite "big data".
          </p>
          <Code>{code3}</Code>
        </section>
        <section>
          <p>
          <b>Round 1: Line Count. </b> A simple task: count the number of records. Of course, this can be done in Bash using <span className="code-block">wc</span> but let's use <span className="code-block">awk</span>.
          </p>
          <Code>{code4}</Code>
          <pre className="space box">
          32000001
          <br />
real	0m0.136s
          <br />
user	0m0.086s
          <br />
sys	 0m0.146s
          <br />
          32000001
          <br />
real	0m2.425s
          <br />
user	0m0.389s
          <br />
sys	 0m0.036s
          </pre>
          <p>
            Explanation:
            <ol>
              <li>When <span className="code-block">awk</span> receives a file name as its argument, it executes the code enclosed in curly braces (hereafter referred to as an "action") within single quotes for each line in the input file.
              </li>
              <li>
              Here, it outputs the value of the built-in <span className="code-block">NR</span> variable, representing the line number of the presently processed line
              </li>
              <li>
              The presence of the built-in <span className="code-block">END</span> token before the curly braces instructs <span className="code-block">awk</span> to execute that action solely for the final line, resulting in the display of the line number of the last line.
              </li>
            </ol>
          </p>
          <p>
            The Spark counterpart is trivial.
          </p>
          <Code>{code5}</Code>
          <pre className="space box">
            32000001<br/>
4.91 s ± 47.3 ms per loop (mean ± std. dev. of 7 runs, 1 loop each)
          </pre>
          <p>
          At first glance, <span className="code-block">awk</span>, at under 3 seconds, is much faster than Spark, which took about 5 seconds. However, <span className="code-block">rdd.count</span> doesn't solely calculate the count for the RDD; it triggers the execution of the entire Directed Acyclic Graph (DAG), specifically <span className="code-block">sc.textFile(file_name, n_cores).map(lambda a: a.split(",")).map(lambda a: (int(a[0]), (int(a[1]),))).count()</span>. To mitigate this, we can optimize performance by caching the intermediate RDD in Spark's executor memory, preventing the need for re-evaluating the DAG with each invocation. This optimization results in a notable reduction in Spark's execution time, now accomplished in just 1 second.
          </p>
          <Code>{code6}</Code>
          <pre className="space box">
          32000001<br/>
918 ms ± 23 ms per loop (mean ± std. dev. of 7 runs, 1 loop each)
          </pre>
          <p><b>Round 1 Winner: Spark</b></p>
        </section>
        <section>
          <p><b>Round 2: Narrow Transformations. </b>Let's consider a standard map-reduce operation: Square all the even values and sum them. Here's how to <span className="code-block">awk</span> it:
          </p>
          <Code>{code7}</Code>
          <pre className="space box">
          51714956044
          <br />
real	0m11.573s
          <br />
user	0m11.524s
          <br />
sys	 0m0.048s
          </pre>
          <p>
            Explanation:
            <ol>
              <li>The <span className="code-block">-F</span> flag instructs <span className="code-block">awk</span> to split the file by a comma.</li>
              <li>The first single quote marks the beginning of the specified actions.</li>
              <li>The first curly brace indicates the start of the first action.</li>
              <li>The <span className="code-block">if ($2 % 2 == 0)</span> checks if the second column (split by the comma) is even.</li>
              <li>The <span className="code-block">s += $2 ** 2</span> accumulates the square of current column value to the variable <span className="code-block">s</span>.</li>
              <li>The <span className="code-block">WND</span> asks awk to run the next action after it reads the last line.</li>
              <li>This last action (<span className="code-block">{cmd1}</span>) prints out the accumulated variable <span className="code-block">s</span>.</li>
            </ol>
          </p>
          <p>
          The Spark counterpart for this is comparitively straightforward and, as it turns out, blazing fast.
          </p>
          <Code>{code8}</Code>
          <pre className="space box">
          51714956044<br/>
1.82 s ± 17.3 ms per loop (mean ± std. dev. of 7 runs, 1 loop each)
          </pre>
          <p>Why is Spark so much faster? Let's look at how Spark has partitioned the RDD.</p>
          <Code>plot(get_partitions(rdd))</Code>
          <div className="image-wrapper-5">
            <div className="image-subwrapper">
              <img src={partitions_map} alt="The partitions for a narrow transformation" />
            </div>
            <b>Figure 1: The partitions for a map transformation</b>
          </div>
          <p>
          Given the uniform distribution of all 32 million values of key 1 across the 16 cores, Spark can effectively parallelize our operations. Despite the potential for parallelization in awk, why does it lag behind in performance?
          </p>
          <p>
          One contributing factor is that we'd cached our RDD, eliminating the need to repeatedly read from the CSV and parse the data. On the other hand, <span className="code-block">awk</span> still processes the CSV line-by-line, incurring the overhead of reading and splitting it for each operation. Another plausible reason, although speculative, could be that <span className="code-block">awk</span> has to spawn threads for each computation upon invocation, introducing a delay. In contrast, Spark maintains active executors, requiring only the loading of code and data transfer, both of which are swift on a single node.
          </p>
          <p><b>Round 2 Winner: Spark</b></p>
        </section>
        <section>
          <p><b>Round 3: Wide transformations.</b> Since our data is skewed, we expect a group by key and sum aggregate to be really slow for both <span className="code-block">awk</span> and Spark. Let's confirm.
          </p>
          <Code>{code9}</Code>
          <pre className="space box">
          0,156
          <br />
1,3167802282
          <br />
real	0m11.005s
          <br />
user	0m10.959s
          <br />
sys	 0m0.044s
          </pre>
          <p>
          Explanation:
          <ol>
            <li><span className="code-block">groups</span> is an associative array in <span className="code-block">awk</span></li>
            <li>To each key in <span className="code-block">groups</span>, we aggregate 2 times the second column, the value.</li>
            <li>After <span className="code-block">awk</span> reads the last line (<span className="code-block">END</span>), we loop through <span className="code-block">groups</span> and print the keys and aggregated value.</li>
          </ol>
          </p>
          <p>
          11 seconds isn't that bad because Spark performs even worse.
          </p>
          <Code>{code10}</Code>
          <pre className="space box">
          [156, 3167802282]<br/>
1min 18s ± 0 ns per loop (mean ± std. dev. of 1 run, 1 loop each)
          </pre>
          <p>
          A quick look at the partitions where the grouped RDD puts each group's values reveals why Spark takes over a minute for this wide transformation.
          </p>
          <Code>{code11}</Code>
          <div className="image-wrapper-5">
            <div className="image-subwrapper">
              <img src={partitions_groupby} alt="The partitions for a wide transformation" />
            </div>
            <b>Figure 2: The partitions for a group-by transformation</b>
          </div>
          <p>
          Spark puts each group's values in a partition. There are two groups, and so there are two partitions. The problem is that the second key has 32 million records (that are in one partition), so they will be processed in a single core and we don't get any concurrency. Of course, we could just reduce by the key, but that wouldn't be fair.
          </p>
          <Code>{code12}</Code>
          <pre className="space box">
          [156, 3167802282]<br/>
2.17 s ± 0 ns per loop (mean ± std. dev. of 1 run, 1 loop each)
          </pre>
          <p>
          How do we solve the data skew problem? One solution is to "salt" the key by appending a random character to it. For example, the key <span className="code-block">1</span> after salting would become any value ranging from <span className="code-block">1_0</span> to <span className="code-block">1_15</span> (because I've got 16 cores). From Spark's perspective, this introduces 16 distinct groups for each key, resulting in a total of 32 groups for the two keys combined. Post-grouping, no single partition or core accumulates a disproportionately high number of records, mitigating the data skew issue.
          </p>
          <Code>{code13}</Code>
          <div className="image-wrapper-5">
            <div className="image-subwrapper">
              <img src={partitions_groupby_salted} alt="The partitions for a salted wide transformation" />
            </div>
            <b>Figure 3: The partitions for a group-by transformation after salting</b>
          </div>
          <p>
          Notice the effect of salting: each partition now contains approximately 2 million rows, and the number of records within each partition is balanced. This configuration enables Spark to effectively parallelize operations on individual partitions. However, upon collecting results, the outcome is dispersed across the salted groups. For instance, the aggregate for key <span className="code-block">1</span> is distributed among salted keys <span className="code-block">1_0</span>, <span className="code-block">1_1</span>, and so forth up to <span className="code-block">1_15</span>. To derive the aggregate for key <span className="code-block">1</span>, it suffices to sum the aggregates of each corresponding salted key.
          </p>
          <Code>{code14}</Code>
          <pre className="space box">
          {'{'}'1': 3167802282, '0': 156{'}'}
          <br />
7.3 s ± 232 ms per loop (mean ± std. dev. of 7 runs, 1 loop each)
          </pre>
          <p>
          At 7 seconds, this is already much faster than <span className="code-block">awk</span>, but we can do better. Observe from Figure 3 that each partition has a number of different groups. This means that when aggregating results for a single group, results from other partitions would need to transportated across partitions (an operation called a shuffle) and aggregated once again. What if we repartition our RDD so that all values belonging to a group go into the same partition? For instance, keys <span className="code-block">0_0</span> and <span className="code-block">1_0</span> could go in partition 0, keys <span className="code-block">0_1</span> and <span className="code-block">1_1</span> could go in partition 1, and so on. This way, we expect to reduce shuffles and reduce the compute time even further.
          </p>
          <Code>{code15}</Code>
          <div className="image-wrapper-5">
            <div className="image-subwrapper">
              <img src={partitions_groupby_salted_repart} alt="The partitions for a wide transformation on salted and repartitioned RDD" />
            </div>
            <b>Figure 4: The partitions for a group-by transformation after salting and repartitioning</b>
          </div>
          <Code>{code16}</Code>
          <pre className="space box">
          {'{'}'1': 3167802282, '0': 156{'}'}
          <br />
4.22 s ± 78.8 ms per loop (mean ± std. dev. of 7 runs, 1 loop each)
          </pre>
          <p>
          That's over 40% faster than our previous run. This is really a niche case, but repartitioning can be a cool trick to address bottlenecks.
          </p>
          <p><b>Round 3 Winner: Spark</b></p>
        </section>
        <section>
          <p><b>Round 4: Cross-Joins. </b>For the final round, we'll attempt to join a tiny CSV containing 9 records with our big CSV and sum each column of the joined dataset. In the tiny CSV, 8 records will have the key <span className="code-block">1</span> and the other record will have key <span className="code-block">2</span>. Since the matching key between the two CSVs is key <span className="code-block">1</span>, we expect the cross join to have <Tex>32000000 \cdot 8</Tex> records.
          </p>
          <Code>{code17}</Code>
          <p>
          The <span className="code-block">awk</span> program to do a this is quite involved, but here it is.
          </p>
          <Code>{code18}</Code>
          <pre className="space box">
          15648000000,12671209128
          <br />
real	1m40.685s
          <br />
user	3m6.951s
          <br />
sys	 0m2.321s
          </pre>
          <p>
          Explanation:
          <ol>
            <li>I'm passing two files to the first <span className="code-block">awk</span>. The first file is <span className="code-block">data_to_join.csv</span> and the second is <span className="code-block">data_big.csv</span>.</li>
            <li><span className="code-block">FNR</span> is an <span className="code-block">awk</span> built-in, a counter that tracks the line number of the currently processed file (as opposed to <span className="code-block">NR</span>, which is a global counter that tracks the total number of processed lines). If <span className="code-block">NR == FNR</span>, the current line we're reading is from the first file.</li>
            <li>If the current line is from the first file, map the key and the value to the line number <span className="code-block">NR</span>. The associative array <span className="code-block">a</span> maps the line number to the key and the associative array <span className="code-block">b</span> maps the line number to the value. We'll be using these "reverse maps" in the second file.</li>
            <li>The for loop runs only for the second file's lines. For each line number in <span className="code-block">a</span>, check if the key (from the first file's line) matches the current file's line's key. If it does, print <span className="code-block">b[k]</span>, which is the first file's line's value, and <span className="code-block">$2</span> which is the second file's line's value to stdout.</li>
            <li>The second <span className="code-block">awk</span> receives the comma separated cross-join of the previous <span className="code-block">awk</span> and accumulates the sum of each column to <span className="code-block">s1</span> and <span className="code-block">s2</span> before printing it on <span className="code-block">END</span>.</li>
          </ol>
          </p>
          <p>
          That was tricky! I would have liked a cleaner way to do this without having to maintain two associative arrays, but this will do for now. The Spark version will be much easier. But first, we need to read the small RDD.
          </p>
          <Code>{code19}</Code>
          <p>
          A quick note: I'm flattening the values in my big RDD (they used to be tuples previously) so that the joins are slightly better to work with.
          </p>
          <Code>{code20}</Code>
          <pre className="space box">
          [(1, (12671209128, 15648000000))]
          <br />
4min 2s ± 0 ns per loop (mean ± std. dev. of 1 run, 1 loop each)
          </pre>
          <p>
          Once again, Spark is much slower than <span className="code-block">awk</span> out-of-the-box. Let's look at the partitions to understand what's going wrong.
          </p>
          <Code>{code21}</Code>
          <div className="image-wrapper-5">
            <div className="image-subwrapper">
              <img src={partitions_big_rdd} alt="The partitions of the big RDD in a cross-join" />
            </div>
            <b>Figure 5: The partitions of the big RDD in a cross-join</b>
          </div>
          <div className="image-wrapper-5">
            <div className="image-subwrapper">
              <img src={partitions_small_rdd} alt="The partitions of the small RDD in a cross-join" />
            </div>
            <b>Figure 6: The partitions of the small RDD in a cross-join</b>
          </div>
          <p>
          The smaller RDD confines key <span className="code-block">1</span>'s values to just two partitions, whereas the larger RDD distributes key <span className="code-block">1</span>'s values across all 16 partitions. Essentially, there are 14 dormant partitions, rendering 14 cores inactive. Spark lacks the inherent intelligence to duplicate or replicate the smaller dataset across the remaining partitions, so we'll have to intervene.
          </p>
          <p>
            Since a cross-join is essentially a cartesian product of the values corresponding to key <span className="code-block">1</span>, the matching key, we can replicate the key-value pairs in the small RDD to each partition. This way each data point in each partition of the big RDD will have a matching key-value pair in the small RDD to join with (within the same partition).
          </p>
          <Code>{code22}</Code>
          <div className="image-wrapper-5">
            <div className="image-subwrapper">
              <img src={partitions_salted_small_rdd} alt="The partitions of the salted small RDD in a cross-join" />
            </div>
            <b>Figure 6: The partitions of the salted small RDD in a cross-join</b>
          </div>
          <p>Since our keys are salted, we'll have to aggregate manually as before.</p>
          <Code>{code23}</Code>
          <pre className="space box">
          {'{'}1: [12671209128, 15648000000]{'}'}
          <br />
15.2 s ± 0 ns per loop (mean ± std. dev. of 1 run, 1 loop each)
          </pre>
          <p>
          <b>Round 4 Winner: Spark</b>
          </p>
        </section>
        <section>
          <b>Conclusion. </b><span className="code-block">awk</span> is a fantastic tool and that's surprisingly good at data-driven workloads. But in the end, it's no match for an optimized Spark. The message, then, is clear: If you've got skewed data and don't know how to tune Spark, stick to <span className="code-block">awk</span> for your ML projects.
        </section>
        <p>&nbsp;</p>
      </article>
    );
  }
}
