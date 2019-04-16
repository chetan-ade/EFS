'''APRIORI ALGO'''


def isSubSet(a, b):
    # returns true if list a is subset of list b
    for i in a:
        present = False
        for j in b:
            if int(i) == int(j):
                present = True
                break
        if present == False:
            return False
    return True


if __name__ == "__main__":
    # min_support = int(input("Enter min support: "))
    # confidence = int(input("Enter confidence %: "))
    min_support = 2
    confidence = 50

    inputList = [
        [1, 2, 5],
        [2, 4],
        [2, 3],
        [1, 2, 4],
        [1, 3],
        [2, 3],
        [1, 3],
        [1, 2, 3, 5],
        [1, 2, 3],
    ]

    distinctItems = []
    for i in inputList:
        for j in i:
            if j not in distinctItems:
                distinctItems.append(j)

    distinctItems = sorted(distinctItems)
    print("Items: ", distinctItems)

    distinctItemsCount = {}
    for item in distinctItems:
        count = 0
        for i in inputList:
            for j in i:
                if j == item:
                    count = count+1
        distinctItemsCount[item] = count
    print("Items with count: ", distinctItemsCount)

    L = {}  # contains itemSet with freq more than min_support
    C = []  # contains all possible itemSets
    tempL = {}
    tempC = {}

    for itemCountPair in distinctItemsCount.items():
        if itemCountPair[1] >= min_support:
            L[itemCountPair[0]] = itemCountPair[1]
    print("\nL1: ", L)

    for item in L.keys():
        C.append(item)
    print("C1: ", C)

    for i in distinctItems:
        for j in distinctItems:
            if i < j:
                tempC[str(i)+","+str(j)] = 0
    print("tempC: ", tempC)

    for itemsCountPair in tempC:
        items = list(itemsCountPair)
        items.remove(',')
        # print(items, end="")
        count = 0
        for i in inputList:
            if(isSubSet(items, i)):
                count = count + 1
        # print(" Count: ", count)

        if count >= min_support:
            st = ""
            for i in items:
                st = st + str(i) + ","
            st = st[:-1]
            tempL[st] = count

    L = tempL
    print("\nL2: ", L)
    C = []
    for item in L.keys():
        C.append(item)
    print("C2:", C)

    tempC = {}
    for i in L.items():
        items = list(i[0])
        items.remove(',')
        # print(items, end="")

        for j in L.items():
            pair = list(j[0])
            pair.remove(',')
            if items[0] == pair[0] and items[1] < pair[1]:
                # print("combination: ", items, pair)
                temp = [i for i in items]
                temp.extend(pair)
                temp.pop(2)
                st = ""
                for k in temp:
                    st = st + k + ","
                st = st[:-1]
                tempC[st] = 0
    # print(tempC)
    print("tempC: ", tempC)
    L = {}
    for itemSet in tempC:
        set1 = itemSet[0:3]
        set2 = itemSet[2:5]
        set3 = itemSet[0]+itemSet[-2]+itemSet[-1]
        list2 = [set1, set2, set3]
        # print(set1+" "+set2+" "+set3)
        flag = True
        for i in list2:
            if i not in C:
                flag = False
        if flag == True:
            L[itemSet] = 0

    print("\nL3: ", L)
    C = []
    for item in L.keys():
        C.append(item)
    print("C3:", C)
    tempC = {}
    for i in C:
        for j in C:
            if i[0] == j[0] and i[2] == j[2] and i[4] < j[4]:
                temp = list(i)
                temp.extend(j)
                sett = set(temp)
                sett.remove(',')
                temp = list(sett)
                temp = sorted(temp)
                st = ""
                for k in temp:
                    st = st + k + ","
                st = st[:-1]
                tempC[st] = 0
    print("tempC: ", tempC)

    for i in tempC:
        # print("i:", i)
        flag = 0
        sett = set(i)
        sett.remove(',')
        # print(sett)
        temp = list(sett)
        temp = sorted(temp)
        # print(temp)
        for k in temp:
            stt = ""
            for j in temp:
                if j != k:
                    stt = stt+j+","
            stt = stt[:-1]
            # print(stt)
            if stt not in C:
                flag = 1
                tempC[i] = -1
                break
        # print(tempC)
        L = {}
        for i in tempC.items():
            if i[1] != -1:
                L[i[0]] = i[1]
        # print(L)
        if L == {}:
            print("L4:", L)
