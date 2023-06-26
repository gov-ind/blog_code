import numpy as np

class Node():
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

        # If the left and right child of a node is not the same we have a split
        # node
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
            neighbours.append((node.parent, path + ['parent']))
        if node.left and node.left.id not in visited:
            neighbours.append((node.left, path + ['left']))
        if node.right and node.right.id not in visited:
            neighbours.append((node.right, path + ['right']))

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
    ix = path[::-1].index('parent')

    # Travel up to the top-most parent
    for dir in path[:-ix]:
        node = node.parent

    # Change each feature in the remaining path
    for dir in path[-ix:]:
        thresh = threshold[node.id]
        feat = feature[node.id]

        if dir == 'left':
            if adv_sample[feat] > thresh:
                adv_sample[feat] = thresh - 1e-3
            node = node.left
        else:
            if adv_sample[feat] <= thresh:
                adv_sample[feat] = thresh + 1e-3
            node = node.right

    return adv_sample