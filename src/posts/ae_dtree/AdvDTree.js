import React, { Component } from 'react';
import Code from '../../CodeBlock';
import Title from '../../Title';
import tree_viz from './tree_viz.png';
import dtree_preds from './dtree_preds.png';
import path_length_viz from './path_length_viz.png';
import ensemble_ae from './ensemble_ae.png';

const code1 = `import numpy as np
from sklearn.tree import DecisionTreeClassifier

np.random.seed(0)

# Create toy data
num_samples = 20
num_classes = 3
X = np.random.rand(num_samples, 4)
y = np.random.randint(0, num_classes, size=(num_samples,))

clf = DecisionTreeClassifier(random_state=1234)
model = clf.fit(X, y)`;

const code2 = `from matplotlib import pyplot as plt
from sklearn import tree

fig = plt.figure(figsize=(6, 20))
tree.plot_tree(
    clf,
    feature_names=[f"f{i}" for i in range(X.shape[1])],
    class_names=[f"c{i}" for i in set(y)],
    filled=True,
)
plt.show()

print(clf.predict([[0.9, 0.2, 0.5, 0.3]]))`;

const code3 = `class Node:
    def __init__(self, id):
        self.id = id
        self.left = None
        self.right = None
        self.parent = None
        self.cls = None


def unpack_tree(clf):
    root = Node(0)

    children_left = clf.tree_.children_left
    children_right = clf.tree_.children_right
    feature = clf.tree_.feature
    threshold = clf.tree_.threshold

    stack = [root]

    while len(stack) > 0:
        nxt = stack.pop()
        node_id = nxt.id

        # If the left and right child of a node is not the same we have a
        # split node
        is_split_node = children_left[node_id] != children_right[node_id]
        # If a split node, append left and right children and depth to \`stack\`
        # so we can loop through them
        if is_split_node:
            left_node = Node(children_left[node_id])
            right_node = Node(children_right[node_id])

            left_node.parent = right_node.parent = nxt
            nxt.left = left_node
            nxt.right = right_node

            stack.append(left_node)
            stack.append(right_node)
        else:
            nxt.cls = clf.tree_.value[nxt.id].argmax()

    return root, feature, threshold`;

const code4 = `print(clf.predict([[0.9, 0.2, 0.5, 0.342 + 1e-3]])) # 0`;

const code5 = `def bfs(start, target_cls=2):
    queue = [(start, [])]
    visited = [start.id]

    while len(queue) > 0:
        node, path = queue[0]
        queue = queue[1:]

        if node.cls == target_cls:
            return path

        neighbours = []
        if node.parent and node.parent.id not in visited:
            neighbours.append((node.parent, path + ["parent"]))
        if node.left and node.left.id not in visited:
            neighbours.append((node.left, path + ["left"]))
        if node.right and node.right.id not in visited:
            neighbours.append((node.right, path + ["right"]))

        for neighbour in neighbours:
            queue.append(neighbour)
            visited.append(neighbour[0].id)


# Starting from the root node, travel to the leaf node
# that predicts a sample
def traverse_to_node(node, sample, feature, threshold):
    path = []
    while True:
        path.append(node.id)
        if sample[feature[node.id]] <= threshold[node.id]:
            if node.left is None:
                break
            else:
                node = node.left
        else:
            if node.right is None:
                break
            else:
                node = node.right
    return node, np.array(path)


def create_adv_example(clf, sample, target_cls=0):
    root, feature, threshold = unpack_tree(clf)

    adv_sample = sample.copy()

    # Get the leaf node
    node, _ = traverse_to_node(root, sample, feature, threshold)

    # Get the shortest path from the leaf node to the target class's leaf node
    path = bfs(node, target_cls=target_cls)
    # Index of the top-most parent
    ix = path[::-1].index("parent")

    # Travel up to the top-most parent
    for dir in path[:-ix]:
        node = node.parent

    # Change each feature in the remaining path
    for dir in path[-ix:]:
        thresh = threshold[node.id]
        feat = feature[node.id]

        if dir == "left":
            if adv_sample[feat] > thresh:
                adv_sample[feat] = thresh - 1e-3
            node = node.left
        else:
            if adv_sample[feat] <= thresh:
                adv_sample[feat] = thresh + 1e-3
            node = node.right

    return adv_sample


sample = X[1]
print(sample)
print(clf.predict([sample]))


def create_adv_examples(clf, sample, num_classes=num_classes):
    actual_label = clf.predict([sample])[0]
    adv_samples = []

    for target_cls in range(num_classes):
        if target_cls == actual_label:
            continue
        adv_samples.append(create_adv_example(clf, sample, target_cls=target_cls))

    target_cls = 0
    for adv_sample in adv_samples:
        if target_cls == actual_label:
            target_cls += 1
        assert clf.predict([adv_sample])[0] == target_cls
        target_cls += 1

    return adv_samples


adv_samples = create_adv_examples(clf, sample)`;

const code6 = `import torch
from torchvision import transforms
import torchvision.datasets as dsets

train_data = dsets.MNIST(
    root="./data", train=True, transform=transforms.ToTensor(), download=True
)
test_data = dsets.MNIST(
    root="./data", train=False, transform=transforms.ToTensor(), download=True
)

X, y = [], []
X_test, y_test = [], []

for row in train_data:
    X.append(row[0])
    y.append(row[1])

for row in test_data:
    X_test.append(row[0])
    y_test.append(row[1])

X = torch.vstack(X)
X = X.reshape(X.shape[0], -1).numpy()
y = np.array(y)
X_test = torch.vstack(X_test)
X_test = X_test.reshape(X_test.shape[0], -1).numpy()
y_test = np.array(y_test)

clf = DecisionTreeClassifier(random_state=1234)
print("Starting training")
model = clf.fit(X, y)
print("Done")

y_pred = clf.predict(X_test)
accuracy = (y_pred == y_test).sum() / y_test.shape[0]
print(f"Accuracy: {accuracy}")

sample = X[1]

adv_samples = create_adv_examples(clf, sample, num_classes=10)

print("Number of pixels changed:")
for adv_sample in adv_samples:
    print((adv_sample != X[1]).sum())

f, ax = plt.subplots(1, 9)
f.set_figwidth(16)

for i in range(9):
    ax[i].imshow(adv_samples[i].reshape(28, 28))
    ax[i].axis("off")

plt.show()`;

const code7 = `import networkx as nx
import pylab as plt

np.random.seed(1)
G = nx.Graph()

root, feature, threshold = unpack_tree(clf)
_, decision_path_original = traverse_to_node(root, X[1], feature, threshold)
_, decision_path_adv = traverse_to_node(root, adv_samples[0], feature, threshold)

first_branch = True
ln = len(decision_path_original)
offset = 0.5
val_map = {}

for i in range(ln):
    dir = np.random.choice([-0.1, 0.1])
    offset += dir
    G.add_node(decision_path_original[i], pos=(offset, ln - i))
    if (
        i < decision_path_adv.shape[0]
        and decision_path_adv[i] != decision_path_original[i]
    ):
        if first_branch:
            offset_branch = offset - 2 * dir
            G.add_node(decision_path_adv[i], pos=(offset_branch, ln - i))
            G.add_edge(decision_path_original[i - 1], decision_path_adv[i])
            val_map[decision_path_original[i - 1]] = "red"

            first_branch = False
        else:
            offset_branch -= dir
            G.add_node(decision_path_adv[i], pos=(offset_branch, ln - i))
            G.add_edge(decision_path_adv[i - 1], decision_path_adv[i])

        val_map[decision_path_adv[i]] = "red"

    if i > 0:
        G.add_edge(decision_path_original[i - 1], decision_path_original[i])

values = [val_map.get(node, "blue") for node in G.nodes()]

pos = nx.get_node_attributes(G, "pos")

plt.figure(figsize=(5, 30))
nx.draw(
    G,
    pos,
    with_labels=True,
    font_size=6,
    node_size=500,
    node_color=values,
    font_color="white",
    node_shape="s",
)

plt.show()`;

const code8 = `def predict(clfs, x):
    preds = []
    for clf in clfs:
        preds.append(clf.predict(x)[0])
    return max(set(preds), key=preds.count)


def fit_ensemble(X, y, n_clfs=5):
    clfs = []
    for i in range(n_clfs):
        print(f"Training clf: {i}")
        ix = np.random.choice(range(X.shape[0]), X.shape[0] // 5)
        X_ = X[ix]
        y_ = y[ix]

        clf = DecisionTreeClassifier(random_state=i)
        clf.fit(X_, y_)

        clfs.append(clf)
    return clfs


def get_constraints(clf, sample, target_cls=0):
    root, feature, threshold = unpack_tree(clf)

    # Get the leaf node
    node, _ = traverse_to_node(root, sample, feature, threshold)

    # Get the shortest path from the leaf node to the target class's leaf node
    path = bfs(node, target_cls=target_cls)
    # Index of the top-most parent
    ix = path[::-1].index("parent")

    # Travel up to the top-most parent
    for dir in path[:-ix]:
        node = node.parent

    constraints = []
    # Don't change each feature in the remaining path,
    # add it to constraints
    for dir in path[-ix:]:
        thresh = threshold[node.id]
        feat = feature[node.id]

        if dir == "left":
            constraints.append((f"f{feat}", "<=", thresh))
            node = node.left
        else:
            constraints.append((f"f{feat}", ">", thresh))
            node = node.right

    return constraints


clfs = fit_ensemble(X, y, n_clfs=100)

sample = X[1]
constraints = []
target_cls = 1

for clf in clfs:
    root, feature, threshold = unpack_tree(clf)
    actual_label = clf.predict([sample])[0]

    if actual_label == target_cls:
        continue
    constraints_ = get_constraints(clf, sample, target_cls=target_cls)

    constraints.append(constraints_)

for i, constraint in enumerate(constraints[:5]):
    print(f"Classifier {i}: {constraint}")

from z3 import Real, Solver, sat

vars = {}
s = Solver()

# Greedy
for constraint_ in constraints:
    prev_constraints = s.assertions()
    for constraint in constraint_:
        feat, sign, thresh = constraint
        if feat not in vars:
            vars[feat] = Real(feat)
        if sign == ">":
            s.add(vars[feat] > thresh)
        else:
            s.add(vars[feat] <= thresh)
        # If we reach an unsolvable constraint, skip it,
        # and recreate the solver with the previous constriaints
        if s.check() != sat:
            s = Solver()
            for prev_constraint in prev_constraints:
                s.add(prev_constraint)
            break

s.check()
model = s.model()
adv_sample = sample.copy()
n_pixels_changed = 0

for feat in vars:
    val = model[vars[feat]]
    if val is None:
        continue
    n_pixels_changed += 1
    val = val.as_fraction()
    val = float(val.numerator) / float(val.denominator)
    adv_sample[int(feat[1:])] = val

print(f"Number of pixels changed: {n_pixels_changed}")
print(f"Predicted class: {clf.predict([adv_sample])[0]}")
fig, ax = plt.subplots(nrows=1, ncols=2)
ax[0].imshow(sample.reshape(28, 28))
ax[1].imshow(adv_sample.reshape(28, 28))
plt.show()`;

const code9 = `num_classes = 2
X = pd.read_csv(
    "https://raw.githubusercontent.com/gov-ind/datasets/main/loan_default_processed.csv",
    index_col=0,
)
print(X.iloc[:5, -7:])

y = X["status"]
X_ = X.drop("status", axis=1)

cols = X.columns

X = np.array(X_)
y = np.array(y)

clf = DecisionTreeClassifier(random_state=0, max_depth=4)
model = clf.fit(X, y)

sample = X[0]
actual_label = clf.predict([sample])[0]

root, feature, threshold = unpack_tree(clf)
target_cls = 0

adv_sample = create_adv_example(clf, sample, target_cls=target_cls)

assert clf.predict([adv_sample])[0] == target_cls

mask = sample != adv_sample

for feature, v1, v2 in zip(cols[mask], sample[mask], adv_sample[mask]):
    print(f"Modified feature: {feature}, Old: {v1}, New: {v2}")`;

export default class extends Component {
  render() {
    return (      
        <div className='content'>
          <Title title={this.props.title} date={this.props.date} cat={this.props.cat} />
          <p>Recently, one of my colleagues asked me if there were any adversarial examples (AEs) against gradientless models such as decision trees. It's a good question: after all, many AE generation techniques rely on gradient-based optimizations of the model's inputs. In the absence of gradients, attacking these types of models becomes an algorithmic optimization challenge rather than a numerical one. This may be easier for programmers without an advanced mathematics background to grok.
          </p>
          <p>
          We'll choose decision trees as they're interpretable and easy to implement using sklearn. Let's start by fitting some toy data with 4 features <span className='code-block'>f0, f1, f2, f3</span> to three classes <span className='code-block'>c0, c1, c2</span> and visualize how it makes inferences. Our objective is to perturb a sample just enough to get it misclassified.
          </p>
          <Code>{code1}</Code>
          <p>
          Recall that decision trees are simply binary trees whose nodes split according to the value of an instance's feature. To predict a class label for a given instance, we begin at the root node and follow branches determined by feature values until reaching a leaf node representing the predicted outcome. For example, consider the following input: <span className='code-block'>[.9, .2, .5, .3]</span>. Starting from the root node in Figure 1, the following splits are traversed until we reach the purple leaf node at the bottom corresponding to the class <span className='code-block'>c2</span>: <span className='code-block'>f2 {'>'} .45, f1 {'>'} 182, f0 {'<='} .97, f2 {'<='} .882, f2 {'<='} .586, f3 {'<='} .342</span>.
          </p>
          <Code>{code2}</Code>
          <div className='image-wrapper-5'>
            <div className='image-subwrapper'>
              <img src={tree_viz} />
            </div>
            <b>Figure 1: The splits of a decision tree</b>
          </div>
          <p>
            It's a good idea to look under the hood of the model and make sure that this is indeed what's happening inside. Fortunately, sklearn's documentation provides excellent resources to unpack a decision tree into a binary tree <span className='code-block'>Node</span> and trace the path taken by the forward pass.
          </p>
          <Code>{code3}</Code>
          <p>
          Our goal is to make a slight perturbation to this input's features to get it "misclassified" (or at least, put in a different class). Getting it to be in class <span className='code-block'>c0</span> is actually straightforward: simply changing <span className='code-block'>f3</span> to be slightly greater than <span className='code-block'>.342</span> would change the last split to take the path towards <span className='code-block'>c0</span> instead of <span className='code-block'>c2</span>. Thus, <span className='code-block'>[.9, .2, .5, .342 + 1e-3]</span> is our adversarial example.
          </p>
          <Code>{code4}</Code>
          <p>
          It's not always this easy, though. What if our target class was <span className='code-block'>c1</span>? Again, we need to change only one feature, in this case, <span className='code-block'>f2</span> to be greater than <span className='code-block'>.882</span>, to change the predicted class to <span className='code-block'>c1</span>. How did we know that it was <span className='code-block'>f2</span> that needed to be changed? Because <span className='code-block'>f2</span> lies on the shortest path between our original class (<span className='code-block'>c2</span>) leaf node and target class leaf node (<span className='code-block'>c0</span>). This path is <span className='code-block'>[f3 {'<='} .342, f2 {'<='} .586, f2 {'<='} .882]</span>. Note that we do not actually need to change the nodes leading up to the highest node in our shortest path. The highest node in our path is <span className='code-block'>f2 {'<='} .882</span>, and the nodes leading up to it are <span className='code-block'>f3 {'<='} .342 and f2 {'<='} .586</span>. This is because the tree makes inferences starting from the root node <span className='code-block'>f2 {'<='} .45</span>, and the path leading to the leaf node <span className='code-block'>c1</span> won't ever need to pass through <span className='code-block'>f3 {'<='} .342 and f2 {'<='} .586</span> anyways.
          </p>
          <p>
          In short, to change the label of an instance, we should find the shortest path between the original class's leaf node and the target class's lead node, prune the nodes in this path leading up to the highest node, and change the remaining features. We can find the shortest path using a Breadth-First Search, using the attributes <span className='code-block'>left</span> and <span className='code-block'>right</span> to denote directions to take when traversing. We'll need to track the highest node as well, so we'll mark it using the attribute <span className='code-block'>parent</span> during our BFS. Finally, once we have our pruned path, we change each feature by either adding or subtracting a small value (<span className='code-block'>1e-3</span> here) depending on whether the direction is <span className='code-block'>left</span> or <span className='code-block'>right</span>.
          </p>
          <Code>{code5}</Code>
          <p>
          <b>Are these AEs?</b> Not necessarily. These are the smallest perturbations needed to change the label of a sample, but if they're not imperceptible to humans, they aren't AEs. To see how the results look on real data, let's fit the tree on MNIST and create some AEs for the digit 0.
          </p>
          <Code>{code6}</Code>
          <div className='image-wrapper-5'>
            <div className='image-subwrapper'>
                <img src={dtree_preds} />
            </div>
            <b>Figure 2: 9 adversarial examples for 0</b>
          </div>
          <p>
          They still look like a zeros to me, so they're definitely AEs. Note that we only needed to change about 2 pixels on average to change the label, so this shows how brittle/overfit the decision tree is, despite it having a test accuracy of 88%.
          </p>
          <p>
            We can see why only 2 out of 768 pixels needed to be modified by visualizing the shortest path traversed for an example. In Figure 3, a portion of the decision tree's nodes, note that in the path between the orginal class's leaf node 3354 and the target class's leaf node 3439, only three features actually needed to be changed because there's a very short path of three nodes from the highest node 3213 to the leaf node 3439. In other words, our tree has a high balance factor, making AE generation easy. It appears that minimizing the balance factor of the tree while fitting it may improve its generalization, and this is something worth researching.
          </p>
          <Code>{code7}</Code>
          <div className='image-wrapper-5'>
            <div className='image-subwrapper'>
              <img src={path_length_viz} />
            </div>
            <b>Figure 3: The effective shortest path</b>
          </div>
          <p>
          <b>What about ensembles?</b> For an ensemble of trees, the results can get quite hairy. Recall that ensembles make predictions by taking the majority vote of the predictions of each of its constituent trees. For each tree, we'd have a small proportion of features to change, and as the number of trees increase, the total number of features to change add up (depending on the diversity of the trees or, equivalently, the intersection of features to change for each tree).
          </p>
          <p>
            Here's a test fitting 100 trees to MNIST. For each tree, we can formulate the features to change and the values they need to be changed to as a constraint. We can then collect the 100 constraints, one for each tree, and solve for the constraints using a solver like Z3.
          </p>
          <Code>{code8}</Code>
          <div className='image-wrapper-5'>
            <div className='image-subwrapper'>
              <img src={ensemble_ae} />
            </div>
            <b>Figure 4: An adversarial 0 for a tree ensemble</b>
          </div>
          <p>
          Note that this is a greedy approach - we selected the features as per the shortest path for each tree and calculated the intersection of features for all trees - so the results aren't that great. It's possible that there exists a smaller subset of features to change, but this would mean that we'd need to look at each possible path (and not just the shortest path) for each tree. Perhaps finding intersections over the top-k shortest paths for each tree might be computationally feasible?
          </p>
          <p>
          <b>Are these counterfactual explanations?</b> A prominent difference in the AEs generated for decision trees and the AEs generated for gradient-based models is the sparsity: For trees, only a small proportion of features/pixels needed to be changed while for gradient-based models, all the pixels needed to be changed. Consequently, for trees, each of the few pixels changed needed to be changed be a large value, while for gradient-based models, all the pixels needed to be changed by a very small value.
          </p>
          <p>
          The AEs generated for trees seem a bit like <a href='https://link.springer.com/article/10.1007/s11023-021-09580-9'>counterfactual explanations (CEs)</a>. In CEs, we look to make changes to the best possible features to get a sample misclassified. By "best features" here, we mean the features that make the most sense to a human (as opposed to the human-imperceptible changes required for an AE). For example, a CE for the digit 1 might add a C-shaped curve to the top of the 1 so that it gets classified as a 9 and - importantly - looks like a 9 to a human as well.
          </p>
          <p>Observe that the pixels changes for CEs are sparse much like AEs for trees and unlike AEs for gradient-based models. Unfortunately, for deep trees involving high-dimensional data like images, the perturbations are <i>too</i> sparse, rendering it imperceptible to humans. However, for lower-dimensional tabular data, perhaps an AE is a CE? Here's a quick test on a loan default dataset where we ask the question "what feature, if changed for an applicant whose loan was denied, would have got his loan approved?". Does the AE make sense? Try it out, look at the results, and decide for yourself.
          </p>
          <Code>{code9}</Code>
          <p>&nbsp;</p>
        </div>
    );
  }
};
