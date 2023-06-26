import { faChevronLeft, faChevronRight, faRepeat } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useEffect, useRef, useCallback } from 'react';

import { Button } from '@material-ui/core';
import Title from '../../Title';
import video from '../../media/video.mp4';
import Tex from '../../Tex';

const eq1 = "2^{40}";

const pageMap = {
    0: 0,
    1: 3.5,
    2: 12,
    3: 27,
    4: 37,
    5: null,
    6: 73.5,
    7: 79,
    8: 82
};
const pages = {
  0: <div className='p-r-1 full' style={{ overflowY: 'auto' }}>
    <p>
    An Approximate Nearest Neighbours (ANN) search algorithm is the secret sauce that makes vector databases so fast. In this writeup, the first of a three-part blog post that peeks under the hood of the ANN algorithms used by some state-of-the-art vector databases, we'll look at KD-trees, a basic Exact Nearest Neighbour search algorithm, and Random Projection Trees, an ANN algorithm used by FLANN and Spotify's Annoy.
    </p>
    <p>
    This is also the first time I've tried incorporating videos into my posts, so this experimental, horizontal-split, desktop-only user-interface can seem a bit unconventional. On this left panel, I'll be transcribing what's going on in the 3b1b-style video embedded in the right panel. Use the first and last buttons below to navigate to the previous and next page, and the middle button to replay the current animation. Go ahead and click the button on the right to get started.
    </p>
  </div>,
  1: <div className='p-r-1 full' style={{ overflowY: 'auto' }}>
  <p>
    Is this technique applicable in higher dimensions? Yes, but it's not always effective. If our data is evenly spread out, it works well; Otherwise, as we'll soon see, KD-trees have a drawback.
  </p>
  <p>
    As before, we start by calculating the two centroids of the data, connecting it with a line, and drawing a line orthogonal to this connecting line passing through its mid point, effectively splitting the data into two clusters.
  </p>
  <p>
    We then repeat this process by splitting each cluster in two, starting with the cluster on the top right.
  </p>
</div>,
  2: <div className='p-r-1 full' style={{ overflowY: 'auto' }}>
    <p>
      After we recursively split each sub-cluster (until we reach a stopping condition, here, a tree depth of 2), we should end up with a bunch of centroids (or tree nodes) and their respective splits. When querying for the nearest neighbours of a point, we'll need to traverse along these nodes.
    </p>
    <p>
      Note how at each split, the two centroids capture the direction with the maximum variance. Here, the first split near the origin correctly identifies the 45 degree diagonal along which data is spread. However, later splits are more or less arbitrary as there isn't much of a clear pattern in the sub-clusters.
    </p>
  </div>,
  3: <div className='p-r-1 full' style={{ overflowY: 'auto' }}>
    <p>
      Now that we have all our nodes, let's erase the splits and instead draw paths between each parent node and its children. To find the nearest neighbours of the orange dot, we'll have to start at the root node and traverse these paths using some sort of strategy.
    </p>
    <p>
      The simplest strategy is to greedily traverse the path to the child node that is the closest to the orange dot. Here, the top-right node is closer, so we move there. The next hop will be to the node located to its top-left. Once there, we can conclude our search by finding the closest points to the orange dot in just that cluster.
    </p>
  </div>,
  4: <div className='p-r-1 full' style={{ overflowY: 'auto' }}>
    <p>
      Unfortunately, the greedy search only worked because of the symmetricity of our data. If it were skewed such that each cluster had contrasting covariances, there's no way for our tree to account for each all the directions of variance at each split.
    </p>
    <p>
      For example, look the splits generated now: the orange dot, despite being closer to the points in the bottom-left cluster, is on the wrong side of the first split itself.
    </p>
    <p>
      A greedy search would naively start off by exploring the wrong split and eventually conclude that one of the points in the right cluster is the nearest to the orange dot.
    </p>
  </div>,
  5: <div className='p-r-1 full' style={{ overflowY: 'auto' }}>
    <p>
      The position of the orange dot isn't necessarily an outlier. As it turns out, by the curse of dimensionality, it becomes easier to find such "outliers" as the number of dimensions increase.
    </p>
    <p>
      Another way to think about this is as follows: For 2-dimensional data, we need at least 4 data samples for a KD-Tree to be effective. In other words, for n-dimensional data, since each node splits the data in two, we need at least <Tex>2^n</Tex> data samples to see any performance gains. So unless you've got <Tex>{eq1}</Tex> samples, a KD-Tree isn't going to capture the geometry of your 40-dimensional data very well.
    </p>
  </div>,
  6: <div className='p-r-1 full' style={{ overflowY: 'auto' }}>
    <p>
      Back to the problem: Our splits were unoptimal, so a greedy search wouldn't yield the closest neighbour. What we want to do instead is traverse the right node first but also keep the left node in a queue as a low priority node that we intend on exploring later on. We can then run a priority-based Breadth-First Search, something like Djikstra's algorithm, to find the shortest path from the root node to a cluster centroid that's nearest to the orange dot.
    </p>
    <p>
      Here's how this would proceed: First, travel to both the children of the root node and push both of them into a queue, with the right node being pushed first as it's closer to the orange dot.
    </p>
  </div>,
  7: <div className='p-r-1 full' style={{ overflowY: 'auto' }}>
    <p>
      Next, pop the first node (here, the right node) off the queue and traverse each of its children, pushing each into the queue, which, remember, already has the left node.
    </p>
    <p>
      Depending on its distance from the orange dot, one of these children will be placed ahead of the right node while the other will be placed after it. In either case, we only intend on exploring up to a depth of two for this toy example, so we won't be exploring further from these two node.
    </p>
  </div>,
  8: <div className='p-r-1 full' style={{ overflowY: 'auto' }}>
    <p>
      This means that the only depth-1 node to explore is the right node. Once each of its children are traversed, the search is done, and we'll find that one of its children is the (rightfully) the closest to the orange dot.
    </p>
  </div>,
}
const mnPage = 0;
const mxPage = Object.keys(pages).length + 1;
const videoLen = 84;
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
     existingIntervals[endTime] = setTimeout(() => checkTime(videoRef, endTime), 100);
  }
}

const goToNext = (activePage, setActivePage, videoRef) => {debugger;
  if (activePage < mxPage && activePage in pageMap) {
    activePage++;
    setActivePage(activePage);

    if (pageMap[activePage]) {
      videoRef.current.currentTime = pageMap[activePage];
      videoRef.current.play();

      clearExistingIntervals();
      checkTime(videoRef, getNextPageTime(activePage));
    }
  }
}

const goToPrev = (activePage, setActivePage, videoRef) => {
  if (activePage > mnPage && activePage in pageMap) {
    activePage--;
    setActivePage(activePage);

    if (pageMap[activePage]) {
      videoRef.current.currentTime = pageMap[activePage];
      videoRef.current.play();

      clearExistingIntervals();
      checkTime(videoRef, getNextPageTime(activePage));
    }
  }
}

const getNextPageTime = page => {
  while (!pageMap[++page] && page < mxPage);
  if (page == mxPage) return videoLen;
  return pageMap[page];
}

const getPageTime = page => {
  while (!pageMap[page] && page > 0) page--;
  return pageMap[page];
}

const replay = (activePage, videoRef) => {
  videoRef.current.currentTime = getPageTime(activePage);
  videoRef.current.play();
  clearExistingIntervals();
  checkTime(videoRef, getNextPageTime(activePage));
}

const ANN = props => {
  const [ activePage, setActivePage ] = useState(0);
  let videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && activePage == 0) {
      replay(activePage, videoRef)
    }
  }, [videoRef.current]);
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', 'flex': 1 }}>
      <Title title={props.title} date={props.date} cat={props.cat} className='m-t-0 m-b-0 shadow' />
      <div className='row full' style={{ overflow: 'hidden' }}>
        <div className='column w-50pc full'>
          {pages[activePage]}
        </div>
        <div className='flex full align-items-center' style={{ marginLeft: '1em' }}>
          <video
            ref={videoRef}
            className='w-100pc h-75pc'
            muted='muted'
          >
            <source src={video} type="video/mp4" />
          </video>
        </div>
      </div>
      <div className='row h-3em justify-content-space-between' style={{ borderTop: 'solid 2px #3b4d61', boxShadow: '0px -10px 14px -12px #3b4d61' }}>
            <Button className='full' onClick={() => goToPrev(activePage, setActivePage, videoRef)}>
              <FontAwesomeIcon icon={faChevronLeft}/>
            </Button>
            <Button className='full' onClick={() => replay(activePage, videoRef)}>
              <FontAwesomeIcon icon={faRepeat}/>
            </Button>
            <Button className='full' onClick={() => goToNext(activePage, setActivePage, videoRef)}>
              <FontAwesomeIcon icon={faChevronRight}/>
            </Button>
          </div>
    </div>
  );
}

export default ANN;