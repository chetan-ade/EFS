''' K means Algo 2D to find k clusters from given numbers'''

def dist(i,j):
  '''i and j are two points where i = (x1,y1) and j = (x2,y2) and i[0] = x1 , i[1] = y1 , j[0] = x2 , j[1] = y2'''
  return ((j[1]-i[1])**2 + (j[0]-i[0])**2)

k = int(input("Enter number of clusters: "))
numbers = []
n = int(input("Enter number of points: "))
for i in range(n):
  x = int(input("Enter X"+str(i)+": "))
  y = int(input("Enter Y"+str(i)+": "))
  numbers.append([x,y])
centres = []
#List to hold centres of clusters
for i in range(k):
  cx = int(input("Enter CX"+str(i)+": "))
  cy = int(input("Enter CY"+str(i)+": "))
  centres.append([cx,cy])
print("K: ",k)
print("Numbers: ",numbers)
print("Centres: ",centres)
clusters = []
#3D array to hold clusters
for i in range(k):
  clusters.append([])
#print("Clusters: ",clusters)
#End of initialization

while(True):
  for i in numbers :
      temp = []
      #temp list to hold dist of a number wrt to each centre
      for j in centres :
          temp.append(dist(i,j))
      mini = min(temp)
      #mini will hold the least dist of number and a centre
      clusters[temp.index(mini)].append(i)
  print("Clusters: ",clusters)
  newCentres = []
  for i in clusters:
      sumx = 0
      sumy = 0
      for j in i:
          sumx += j[0]
          sumy += j[1]
      x = sumx/len(i)
      y = sumy/len(i)
      newCentres.append([x,y])
  print("New centres: ",newCentres)
  if centres == newCentres :
      break
  #if centres are same,it means the clusters are also same
  centres = [i for i in newCentres]
  #in case the centres are not same, we will put the newly found centres in the centres list
  clusters = []
  for i in range(k):
      clusters.append([])
  #removing all elements from clusters to form a empty array
