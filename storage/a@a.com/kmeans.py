''' K means Algo to find k clusters from given numbers'''

k = int(input("Enter number of clusters: "))
numbers = [int(x) for x in input("Enter numbers: ").split()]
numbers.sort()
#Sorting the list to find the centres of clusters
print("List: ",numbers)
print("K: ",k)
centres = []
#List to hold centres of clusters
#Finding the initial center of cluster
print("Initial centres of clusters: ",end="")
length = len(numbers)
lenCluster = int(length/k) #approx length of cluster
for i in range(k):
  sum = 0
  for j in range(lenCluster):
      sum +=numbers[i*lenCluster+j]
  #print("Centre["+str(i)+"]: ",sum/lenCluster)
  centres.append(sum/lenCluster)
print(centres)
clusters = []
#2D array to hold clusters
for i in range(k):
  clusters.append([])
#print(clusters)
#print("Centres: ",centres)
#End of initialization

while(True):
  for i in numbers :
      temp = []
      #temp list to hold dist of a number wrt to each centre
      for j in centres :
          temp.append(abs(i-j))
      mini = min(temp)
      #mini will hold the least dist of number and a centre
      clusters[temp.index(mini)].append(i)
  print("Clusters: ",clusters)
  newCentres = []
  for i in clusters:
      sum = 0
      for j in i:
          sum += j
      #print("New centres: ",sum/len(i))
      newCentres.append(sum/len(i))
  print("New centres: ",newCentres)
  if centres == newCentres :
      break
  #if centres are same,it means the clusters are also same
  centres = [i for i in newCentres]
  #in case the centres are not same, we will put the newly found centres in the centres list
  clusters = []
  for i in range(k):
      clusters.append([])
  #removing all elements from clusters to form a empty 2d array

