import numpy as np
from sklearn.tree import DecisionTreeClassifier

np.random.seed(0)

# Create toy data
num_samples = 20
num_classes = 3
X = np.random.rand(num_samples, 4)
y = np.random.randint(0, num_classes, size=(num_samples,))

clf = DecisionTreeClassifier(random_state=1234)
model = clf.fit(X, y)

from matplotlib import pyplot as plt
from sklearn import tree

fig = plt.figure(figsize=(6, 20))
tree.plot_tree(
    clf,
    feature_names=[f"f{i}" for i in range(X.shape[1])],
    class_names=[f"c{i}" for i in set(y)],
    filled=True,
)
plt.show()

print(clf.predict([[0.9, 0.2, 0.5, 0.3]]))


class Node:
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
        # If a split node, append left and right children and depth to `stack`
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

    return root, feature, threshold


print(clf.predict([[0.9, 0.2, 0.5, 0.342 + 1e-3]]))


def bfs(start, target_cls=2):
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


adv_samples = create_adv_examples(clf, sample)

import torch
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

plt.show()

import networkx as nx
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

plt.show()

####


def predict(clfs, x):
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
plt.show()

num_classes = 2
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
    print(f"Modified feature: {feature}, Old: {v1}, New: {v2}")
