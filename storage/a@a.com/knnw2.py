'''KNN algorithm to find which group the given test point belongs to based on dissimilarity'''

data = [
   ['f',1.60,'short' ],
   ['m',2.00,'tall'  ],
   ['f',1.90,'medium'],
   ['f',1.88,'medium'],
   ['f',1.70,'short' ],
   ['m',1.85,'medium'],
   ['f',1.60,'short' ],
   ['m',1.70,'short' ],
   ['m',2.20,'tall'  ],
   ['m',2.10,'tall'  ],
   ['f',1.80,'medium'],
   ['m',1.95,'medium'],
   ['f',1.90,'medium'],
   ['f',1.80,'medium'],
   ['f',1.75,'medium'],
]
point = ['f',1.60]
#The test point

'''Attributes are
   Gender(Male or Female),
   Height(Numberic Value),
   Height Category(short,medium or tall)'''
temp = []
#temp will hold difference between height of input data and test point,and the category to which it belongs
for i in data:
   temp.append([round(abs(i[1]-point[1]),2),i[2]])
   #round(abs(i[1]-point[1]),2) will find the absolute diff between the heights and round function will then round it off to 2 decimal places,i[2] is the height category
k = int(input("Enter value of k: "))
#print(temp)
temp.sort()
#in dissimilarity,we sort in ascending order to get the points with least dissimilarities first
#print(temp)
temp = temp[0:k]
#print(temp)
#slicing the list to get the top k elements
HeightList = [i[1] for i in temp]
#HeightList will hold the value of buy attributes of top k elements. For eg: ['short', 'short', 'medium', 'short', 'short']
#print(HeightList)
print("Test point is:",max(HeightList,key=HeightList.count))
#the above line will print the element with maximum occurances/count in HeightList. For eg: ['short', 'short', 'medium', 'short', 'short'] -> 'short'
