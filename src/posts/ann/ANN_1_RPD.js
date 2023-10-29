import {
  faChevronLeft,
  faChevronRight,
  faRepeat,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect, useRef } from "react";

import { Button } from "@material-ui/core";
import Title from "../../components/Title";
import Tex from "../../components/Tex";
import video from "../../media/ann_video.mp4";

const eq1 = "2^{40}";

const pageMap = {
  0: 0,
  1: 0.8,
  2: 10,
  3: 21,
  4: 50.5,
  5: 103,
  6: 131,
  7: 143,
  8: 161,
  9: 171.5,
  10: null,
  11: 207,
  12: 214,
  13: 220,
  14: 231,
  15: null,
};
const pages = {
  0: (
    <div className="p-r-1 full ann-rpd-sidepanel">
      <p>
        An Approximate Nearest Neighbours (ANN) search algorithm is the secret
        sauce that makes vector databases so fast. In this writeup, the first of
        a three-part blog post that peeks under the hood of the ANN algorithms
        used by some state-of-the-art vector databases, we'll look at K-D trees,
        a basic Exact Nearest Neighbour search algorithm, and Random Projection
        Trees, an ANN algorithm used by FLANN and Spotify's Annoy.
      </p>
      <p>
        This is also the first time I've tried incorporating videos into my
        posts, so this experimental ser-interface can seem a bit unconventional.
        On this left panel, I'll be transcribing what's going on in the{" "}
        <a href="https://www.3blue1brown.com/">3b1b</a>-style video embedded in
        the right panel. Use the first and last buttons below to navigate to the
        previous and next page, and the middle button to replay the current
        animation. Go ahead and click the button on the right to get started.
      </p>
    </div>
  ),
  1: (
    <div className="p-r-1 full ann-rpd-sidepanel">
      <p>
        To keep things simple, we'll start with a one-dimensional example, a set
        of points scattered along the number line. Assume that we a have a point
        (the red one) whose <span className="code-block">k</span> nearest
        neighbours we wish to find.
      </p>
      <p>
        The naive approach is to calculate the distance between this point and
        each point on the number line and return the{" "}
        <span className="code-block">k</span> points with the smallest
        distances. Unfortunately, this doesn't scale very well in real-world
        machine learning pipelines that output up to many millions of vectors.
        We can do better.
      </p>
    </div>
  ),
  2: (
    <div className="p-r-1 full ann-rpd-sidepanel">
      <p>
        One way to speed things up is to use a binary search. We can recursively
        partition our dataset in two, effectively creating a binary tree. We
        could partition till our tree reaches a certain depth - like I have
        here, with a tree depth of 2 - or till each leaf node has only a handful
        of points - like Annoy does, although it uses something more
        sophisticated than a binary tree (more on this soon).
      </p>
      <p>
        To find the nearest neighbour(s), we start by traversing the tree
        starting at the root node in the middle. The red point is to the left of
        this node, so we move to the left child node, and in the process,
        discard all the points to the right of the root node. We repeat this
        process till we reach a leaf node, at which stage we only have a few
        points to compare with. In all, we had to make 7 distance calculations
        (2 for each tree node and 5 at the leaf node), so it's quite a
        significant optimization. However, if the distribution of the points
        were different, a binary search won't be as effecient.
      </p>
    </div>
  ),
  3: (
    <div className="p-r-1 full ann-rpd-sidepanel">
      <p>
        What if our data were distributed unevenly? Note that now, the binary
        tree's depth isn't enough to reach all the points. Moreover, the
        partitions at depth 1 are redundant because there aren't any points at
        all to one of its sides.
      </p>
      <p>
        Clearly, we need to consider <i>where</i> we partition our data
        depending on its distribution. If we can somehow identify the clusters
        present in our data and set the centers of those clusters to be our tree
        nodes, our tree will be optimal again. But how do we find these
        clusters?
      </p>
    </div>
  ),
  4: (
    <div className="p-r-1 full ann-rpd-sidepanel">
      <p>
        We'll use K-Means clustering to find clusters in this example (Annoy and
        FLANN use K-Means too, amongst other techniques). A quick refresher of
        how K-Means works: First, pick <span className="code-block">K</span>{" "}
        points (here we set <span className="code-block">K</span> to 2 because
        at each partition, we're looking to find two clusters). Next, pick a
        random point from the dataset and calculate its distance from each of
        the two points. Finally, move the closer of the two points towards the
        randomly picked point. Repeat the above three steps till the two
        centroids almost converge.
      </p>
      <p>
        Note how the two points move towards the two clusters at each iteration.
        Once we think we've converged at the cluster centroids, we can stop the
        algorithm and declare the the root node of our tree as the point midway
        between these two centroids.
      </p>
    </div>
  ),
  5: (
    <div className="p-r-1 full ann-rpd-sidepanel">
      <p>
        The final step is to repeat this process recursively for each of the two
        partitioned halves until we reach our stopping condition (here, the tree
        depth).
      </p>
      <p>
        The tree that results from this kind of "intelligent" partitioning is
        called a K-D Tree. It's these carefully chosen cluster centroids (or
        indexes/indices, as they are commonly called) that make lookups fast in
        K-D Trees.
      </p>
    </div>
  ),
  6: (
    <div className="p-r-1 full ann-rpd-sidepanel">
      <p>
        Can K-D Trees be used for two-dimensional data? Yes, but alas, it's not
        always effective. If our data is evenly spread out, it works well;
        Otherwise, as we'll soon see, K-D trees have a drawback.
      </p>
      <p>
        As before, we start by calculating the two centroids of the data and
        separating them with an orthogonal hyperplane (here, a line) midway
        between the centroids.
      </p>
    </div>
  ),
  7: (
    <div className="p-r-1 full ann-rpd-sidepanel">
      <p>
        After we recursively partition each sub-cluster (until we reach a
        stopping condition, here, a tree depth of 2 again), we should end up
        with a bunch of centroids that we'll traverse in our nearest
        neighbour(s) search.
      </p>
      <p>
        Note how at each partition, the two centroids capture the direction with
        the maximum variance. Here, the first partition near the origin
        correctly identifies the 45 degree diagonal along which data is spread.
        However, later partition are more or less arbitrary as there isn't much
        of a clear pattern in the sub-clusters.
      </p>
    </div>
  ),
  8: (
    <div className="p-r-1 full ann-rpd-sidepanel">
      <p>
        Now that we have all our nodes, we can find the nearest neighbours of
        the orange dot by starting at the root node and traversing the paths to
        each node using some sort of strategy.
      </p>
      <p>
        The simplest strategy is to greedily traverse the path to the child node
        that is the closest to the orange dot. Here, the top-right node is
        closer, so we move there. The next hop will be to the node located to
        its top-left. Once there, we can conclude our search by finding the
        closest points to the orange dot in just that cluster.
      </p>
    </div>
  ),
  9: (
    <div className="p-r-1 full ann-rpd-sidepanel">
      <p>
        Unfortunately, the greedy search only worked because our data was
        symmetric. If it were skewed such that each cluster had contrasting
        covariances, there's no way for our tree to account for each all the
        directions of variance at each split.
      </p>
      <p>
        For example, look the splits generated now: the orange dot, despite
        being closer to the points in the bottom-left cluster, is on the wrong
        side of the first split itself.
      </p>
      <p>
        A greedy search would naively start off by exploring the wrong split and
        eventually conclude that one of the points in the right cluster is the
        nearest to the orange dot.
      </p>
    </div>
  ),
  10: (
    <div className="p-r-1 full ann-rpd-sidepanel">
      <p>
        The position of the orange dot isn't necessarily an outlier. As it turns
        out, by the curse of dimensionality, it becomes easier to find such
        "outliers" as the number of dimensions increase.
      </p>
      <p>
        Another way to think about this curse is as follows: For 2-dimensional
        data, we need at least 4 data samples for a K-D Tree to be effective. In
        other words, for <span className="code-block">n</span>-dimensional data,
        since each node splits the data in two, we need at least <Tex>2^n</Tex>{" "}
        data samples to see any performance gains. So unless you've got{" "}
        <Tex>{eq1}</Tex> samples, a K-D Tree isn't going to capture the geometry
        of your 40-dimensional data very well.
      </p>
    </div>
  ),
  11: (
    <div className="p-r-1 full ann-rpd-sidepanel">
      <p>
        Back to the problem: Our splits were unoptimal, so a greedy search
        wouldn't yield the closest neighbour. What we want to do instead is
        traverse the right node first but also keep the left node in a queue as
        a low priority node that we intend on exploring later on. We can then
        run a priority-based Breadth-First Search - something like Djikstra's
        algorithm - to find the shortest path from the root node to a cluster
        centroid that's nearest to the orange dot.
      </p>
      <p>
        Here's how this would proceed: First, travel to both the children of the
        root node and push both of them into a queue, with the top-right node
        being pushed first as it's closer to the orange dot.
      </p>
    </div>
  ),
  12: (
    <div className="p-r-1 full ann-rpd-sidepanel">
      <p>
        Next, pop the first node (here, the top-right node) off the queue and
        traverse each of its children, pushing each into the queue, which,
        recall, already has the bottom-left node.
      </p>
      <p>
        Depending on its distance from the orange dot, one of these children may
        be placed ahead of the bottom-left node while the rest will be placed
        after it. In either case, we only intend on exploring up to a depth of
        two for this toy example, so we won't be exploring beyond these two
        nodes.
      </p>
      <p>
        Consequently, the only depth-1 node to explore is the bottom-left node.
        Once each of its children are traversed, the search is done, and we'll
        find that one of its children is rightfully (leftfully?) the closest to
        the orange dot.
      </p>
    </div>
  ),
  13: (
    <div className="p-r-1 full ann-rpd-sidepanel">
      <p>
        Note that the complexity of this algorithm depends on the quality of our
        partitions. Had we been luckier with our first partition, we would've
        had to search through only two nodes instead of three. Is there any way
        to improve our luck? Perhaps if we make multiple sets of partitions, or
        in other words, a forest of K-D Trees, there's a good chance of at least
        one tree being "good".
      </p>
    </div>
  ),
  14: (
    <div className="p-r-1 full ann-rpd-sidepanel">
      <p>
        These K-D Tree forests, also called Random Projection Trees (RP Trees),
        are what Annoy and FLANN use. For each tree in the RP Tree, you could
        either choose the location of the partition to be random (like Annoy) or
        add a bit of jitter to a partition that divides the subspace in two
        (like FLANN).
      </p>
      <p>
        One of these trees will lead to the nearest neighbour(s) of the target
        point. To find this tree, we can traverse each tree in parallel using
        our previous algorithm, except we add each child node to a shared
        priority queue. How long do we traverse? That depends on whether we want
        better recall or a faster lookup: The more we're willing to wait, the
        closer our discovered neighbour will be.
      </p>
    </div>
  ),
  15: (
    <div className="p-r-1 full ann-rpd-sidepanel">
      <p>
        Although there's a lot of implementation details and performance
        optimizations I've skipped, the high-level idea behind an ANN is what
        I've presented here. Here's a quick summary of the key hyperparameters
        you'll be tuning:
        <ol>
          <li>
            The branching factor: The number of child nodes per root node; This
            is 2 for Annoy, but in theory, it could be any number greater than
            2.
          </li>
          <li>
            The tree depth: Deeper trees give your more accurate results, but
            take longer to search.
          </li>
          <li>
            The number of points in a leaf node (called{" "}
            <span className="code-block">k</span> in Annoy): This is essentially
            equivalent to the tree depth; The higher the value of{" "}
            <span className="code-block">k</span> is, the lower your tree depth
            will be.
          </li>
          <li>
            The number of trees: Having more trees will give you more accurate
            results. However, if the number of trees is more than your
            computer's parallelism (say, number of cores), searches will get
            slower.
          </li>
        </ol>
      </p>
      <p>
        In Part 2, we'll look at Heirarchichal Navigable Small Worlds (HNSWs), a
        graph-based extension of K-D Trees, and the Nearest Neighbour Descent,
        an algorithm to construct approximate neighbourhood graphs.
      </p>
    </div>
  ),
};
const mnPage = 0;
const mxPage = Object.keys(pages).length - 1;
let existingIntervals = {};

function clearExistingIntervals() {
  for (const [key, value] of Object.entries(existingIntervals)) {
    clearInterval(value);
    existingIntervals[key] = null;
  }
}

function checkTime(videoRef, endTime) {
  if (!videoRef.current) {
    clearExistingIntervals();
    return;
  }
  if (videoRef.current.currentTime >= endTime) {
    videoRef.current.pause();
  } else {
    existingIntervals[endTime] = setTimeout(
      () => checkTime(videoRef, endTime),
      100,
    );
  }
}

const goToNext = (activePage, setActivePage) => {
  if (activePage < mxPage && activePage in pageMap) {
    activePage++;
    setActivePage(activePage);
  }
};

const goToPrev = (activePage, setActivePage) => {
  if (activePage > mnPage && activePage in pageMap) {
    activePage--;
    setActivePage(activePage);
  }
};

const getNextPageTime = (page) => {
  while (!pageMap[++page] && page <= mxPage);
  return pageMap[page];
};

const getPageTime = (page) => {
  return pageMap[page];
};

const replay = (activePage, videoRef) => {
  const currPageTime = getPageTime(activePage);
  if (currPageTime == null) return;
  videoRef.current.currentTime = currPageTime;
  videoRef.current.play();
  clearExistingIntervals();
  checkTime(videoRef, getNextPageTime(activePage));
};

const ANN = (props) => {
  const [activePage, setActivePage] = useState(0);
  let videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      replay(activePage, videoRef);
    }
  }, [activePage]);

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <Title
        title={props.title}
        date={props.date}
        cat={props.cat}
        className="m-t-0 m-b-0 shadow"
      />
      <div className="ann-rpd-wrapper">
        <div className="ann-rpd-transcription">{pages[activePage]}</div>
        <div className="ann-rpd-video-container">
          <video
            ref={videoRef}
            className="w-100pc h-75pc ann-rpd-video"
            muted="muted"
          >
            <source src={video} type="video/mp4" />
          </video>
        </div>
      </div>
      <div
        className="row h-3em justify-content-space-between"
        style={{
          borderTop: "solid 2px #3b4d61",
          boxShadow: "0px -10px 14px -12px #3b4d61",
        }}
      >
        <Button
          className="full"
          onClick={() => goToPrev(activePage, setActivePage)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <Button className="full" onClick={() => replay(activePage, videoRef)}>
          <FontAwesomeIcon icon={faRepeat} />
        </Button>
        <Button
          className="full"
          onClick={() => goToNext(activePage, setActivePage)}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
      </div>
    </div>
  );
};

export default ANN;
