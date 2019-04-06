''' Agglomerative clustering '''
def distancef(i,j):
  ''' i and j are two points where i = (x1,y1) and j = (x2,y2) and i[0] = x1 , i[1] = y1 , j[0] = x2 , j[1] = y2'''
  return (((j[1]-i[1])**2 + (j[0]-i[0])**2)**0.5)


def printDist():
  ''' Prints the distance matrix in proper format'''
  global dontPrint
  print('')
  #above statement prints a newline
  #print("Dont print:",dontPrint)
  flag = 0
  if dontPrint == []:
    for i in range(n):
      print("Lbl"+str(i),end="   ") #extra spaces at end for clean output
  #there are no elements not to be printed.SO we print all labels.
  else:
    for i in range(n):
      flag = 0
      for j in dontPrint:
        if i == j:
          flag = 1
      if flag == 0:      
        print("Lbl"+str(i),end="   ") #extra spaces at end for clean output
  print('')
  for i in range(n):
      for j in range(n):
        if distance[i][j] == '----':
          pass#print(distance[i][j],end="   ")
        else:
          print("%.2f" %distance[i][j],end="   ")
          #printing each dist with exactly 2 decimal points for uniformity. It changes 1.0 to 1.00 which is nice.
      #print(labels[i],end=" ")
      flag = 0
      if dontPrint == []:
        print("Lbl"+str(i),end="")
      else:
        for k in dontPrint:
          if i ==k:
            flag = 1
        if flag == 0:
          print("Lbl"+str(i),end="")
      print('')
  print('')
  for i in range(n):
    flag = 0
    for j in dontPrint:
      if i == j:
        flag = 1
    if flag == 0:     
      print("Lbl"+str(i)+": "+str(labels[i])+"  ",end="")
  ''' In table we have only printed Labels. If we try to update labels the table looses its alignment.
      So we print all labels below the table.'''
  return


def minDist():
  ''' Function to find min dist with its position in table'''
  for i in range(1,n):
    if distance[0][i] != '----':
      mini = distance[0][i]
      x = i
      break
      #we assign any one number from top row to mini value.We have to do this cause earlier mini would take '----' in some cases.
  ''' We normally use matrix[0][0] as the initial value.But since it is 0 in this case,we take the next element.'''
  for i in range(n):
    for j in range(n):
      if not(distance[i][j] == '----'):
        if (distance[i][j] != 0) and (distance[i][j] <= mini):
          #find min element which is not 0
          mini = distance[i][j]
          x=i
          y=j
  print("\nMinimum dist: ",mini," at (",x,",",y,")")
  return ([mini,x,y])


def updateDist(lop1,lop2):
  ''' We have two list of points lop1 and lop2.We take each element from lop1 and find dist with each element of lop2.Then we find the min dist.'''
  temp = []
  #print("LOP1: ",lop1)
  #print("LOP2: ",lop2)
  #to hold all distances
  for i in lop1:
    for j in lop2:
      temp.append(round(distancef(numbers[i],numbers[j]),2))
  #print("Temp: ",temp)
  #print("MIN: ",min(temp))
  return (min(temp))


def findIndex(point):
  ''' finds the index of given point in the label list.'''
  for i in labels:
    for j in i:
      if j == point:
        return labels.index(i)

if __name__ == "__main__":
  numbers = {}
  n = int(input("Enter number of points: "))
  # for i in range(n):
  #   x = float(input("Enter X"+str(i)+": "))
  #   y = float(input("Enter Y"+str(i)+": "))
  #   numbers['P'+str(i)]=[x,y]
  #numbers = {'P0':[0.4,0.53],'P1':[0.22,0.38],'P2':[0.35,0.32],'P3':[0.26,0.19],'P4':[0.08,0.41],'P5':[0.45,0.3]}
  numbers = {'P0':[2,2],'P1':[3,2],'P2':[1,1],'P3':[3,1],'P4':[1.5,0.5]}
  #print(numbers)
  dist = []
  #distance list which will be converted to a distance matrix
  for i in numbers.values():
    for j in numbers.values():
      dist.append(round(distancef(i,j),2))
  distance = []
  #distance matrix
  for i in range(n):
    distance.append([])
  #making 2d array/list by adding [] to list.End result will be like [[],[],[],[],[],[]]
  j=0
  k=0
  for i in dist:
    distance[j].append(i)
    k = k+1
    if (k%n ==0):
      j = j + 1
  #j is count of elements.Whenever j mod n equals 0,it means we have completed a row and therefore we move to the next row by inc k.
  labels = []
  for i in range(n):
    labels.append(["P"+str(i)])
  #we need a label list as when points are combine,we append one point to another in this label list.
  ''' End of initialization.'''


  dontPrint = []
  #list to hold all the elements that will be combined with other elements and thus we no longer need to print them.
  for i in range(n):
    ''' We have to iterate the loop for only n-1 times. If there are 4 points,
        then after 1st iteration, there will be 3 points; after 2nd iter, 2 points; after 3rd iteration, 1 point.
        The aim is to combine all points into a single point so we stop.
    '''
    printDist()
    if (i==n-1) :
      break
      #for the last iteration we only want to print and do no computation so we printDist() and break out of the loop.
    positions = minDist()
    positions.pop(0)
    #removinf the first element ie min dist to get list with only the positions
    positions.sort()
    #making sure that we combine rigtmost point with leftmost.Not compulsory.
    targetIndex = findIndex("P"+str(positions[0]))
    #print("TargetIndex:" ,targetIndex)
    sourceIndex = findIndex("P"+str(positions[1]))
    #print("SourceIndex: ",sourceIndex)
    #the lower index is the target index as we will combine some other point with this point.  
    #print("index: ",targetIndex)
    labels[targetIndex].extend(labels[sourceIndex])
    updateIndex = targetIndex
    ''' Now we have to update the distances in the table.
        But only the recently combined index will be updated rest matrix will be exactly the same.
        So we compare index of all elements with updateIndex.If same,we update the dist.
    '''
    dontPrint.append(sourceIndex)
    for i in range(n):
      distance[i][updateIndex] = updateDist(labels[i],labels[updateIndex])
    for j in range(n):
      distance[updateIndex][j] = updateDist(labels[updateIndex],labels[j])
    #print("Dont print: ",dontPrint)
    for k in dontPrint:
      for i in range(n):
        distance[i][k] = '----'
      for j in range(n):
        distance[k][j] = '----'
    input("\nPress any key to continue... ")


  #print("Trying out updateDist")
  #updateDist(labels[2],labels[0])
