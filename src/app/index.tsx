import { Text, View, StyleSheet, TextInput, Button, Modal, ScrollView, Pressable } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";

export default function App() {
  const [items, setItems] = useState<
    { id: number; name: string; price: string; memberId: number | null }[]
  >([]);
  const [members, setMembers] = useState<{ id: number; name: string; spent: string }[]>([]);

  const [popupVisible, setPopupVisible] = useState(false);
  const [membersModalVisible, setMembersModalVisible] = useState(false);

  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberSpent, setNewMemberSpent] = useState("");
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const addItem = () => {
    if (!itemName.trim() || !price) return;
    setItems((currentItems) => [
      ...currentItems,
      {
        id: currentItems.length,
        name: itemName.trim(),
        price,
        memberId: selectedMemberId,
      },
    ]);
    setMembers((currentMembers) =>
      currentMembers.map((member) =>
        member.id === selectedMemberId
          ? { ...member, spent: (Number(member.spent) + Number(price)).toString() }
          : member
      )
    );
    setItemName("");
    setPrice("");
    setSelectedMemberId(null);
    setPopupVisible(false);
  };

  const addMember = () => {
    const name = newMemberName.trim();
    if (!name) return;

    setMembers((currentMembers) => [
      ...currentMembers,
      { id: currentMembers.length, name, spent: newMemberSpent || "0" },
    ]);
    setNewMemberName("");
    setNewMemberSpent("");
  };

  const computeItemTotal = () => {
    return items.reduce((total, item) => total + Number(item.price), 0);
  };

  const computeMemberExpenses = (member: { id: number; name: string; spent: string }) => {
    return computeItemTotal()/members.length - Number(member.spent);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.HeaderSection}>
          <Text style={styles.titleHeader}>Expense Splitter</Text>
          <Button title="Members" onPress={() => setMembersModalVisible(true)} />
        </View>
        <Modal
          visible={membersModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setMembersModalVisible(false)}
        >
          <View style={styles.backdrop}>
            <View style={[styles.popup, styles.membersPopup]}>
              <Text>Group Members</Text>
              <ScrollView
                style={styles.memberList}
                keyboardShouldPersistTaps="handled"
              >
                <View style={styles.tableHeader}>
                  <Text>Name</Text>
                  <Text>Spent</Text>
                </View>
                {/* {members.length === 0 ? (
                  <View style={styles.memberRow}>
                    <Text style={styles.placeholderText}>you</Text>
                    <Text style={styles.placeholderText}>spent how much?</Text> 
                  </View>
                ) : ( */}
                  {members.map((member) => (
                    <View key={member.id} style={styles.memberRow}>
                      <Text>{member.name}</Text>
                      <Text>{member.spent}</Text>
                    </View>
                  ))}

                  <View style={styles.phantomRow}>
                    <TextInput
                    value={newMemberName}
                    onChangeText={setNewMemberName}
                    onSubmitEditing={addMember}
                    returnKeyType="done"
                    placeholder="who"
                    style={styles.phantomInput}
                  />
                  <TextInput
                    value={newMemberSpent}
                    onChangeText={(text) => {
                        const numericText = text
                          .replace(/[^0-9.]/g, "")
                          .replace(/(\..*)\./g, "$1");
                        setNewMemberSpent(numericText);
                      }}
                    onSubmitEditing={addMember}
                    returnKeyType="done"
                    placeholder="spent what?"
                    style={[styles.phantomInput, styles.phantomSpentInput]}
                  />
                  </View>
                  
                {/* )} */}
              </ScrollView>
              <Button title="Close" onPress={() => setMembersModalVisible(false)} />
            </View>
          </View>
        </Modal>
        <View style={styles.middleSection}>
          <View style={styles.itemList}>
          {items.length === 0 ? (
            <View style={styles.itemRow}>
              <Text style={styles.placeholderText}>Item name</Text>
              <Text style={styles.placeholderText}>Price</Text>
            </View>
          ) : (
          
          items.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View>
                <Text>{item.name}</Text>
                {item.memberId !== null && (
                  <Text style={styles.itemPayer}>
                    Paid by {members.find((member) => member.id === item.memberId)?.name}
                  </Text>
                )}
              </View>
              <Text>{item.price}</Text>
            </View>
            ))
          )}
            <Modal
              visible={popupVisible}
              transparent
              animationType="fade"
              onRequestClose={() => setPopupVisible(false)}
            >
              <View style={styles.backdrop}>
                <Pressable
                  style={StyleSheet.absoluteFill}
                  onPress={() => setPopupVisible(false)}
                />
                <View style={styles.popup}>
                  <Text>Add an item</Text>
                  <TextInput
                    value={itemName}
                    onChangeText={setItemName}
                    placeholder="Enter an item"
                    style={styles.input}
                  />
                  
                  <View style={styles.priceRow}>
                    <Text>Price:</Text>
                    <TextInput
                      value={price}
                      onChangeText={(text) => {
                        const numericText = text
                          .replace(/[^0-9.]/g, "")
                          .replace(/(\..*)\./g, "$1");
                        setPrice(numericText);
                      }}
                      keyboardType="decimal-pad"
                      placeholder="Pesos"
                      style={[styles.input, styles.priceInput]}
                    />
                  </View>
                  <View>
                    <Text>Paid by</Text>
                    {members.length > 0 ? (
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.memberOptions}
                      >
                        {members.map((member) => (
                          <Pressable
                            key={member.id}
                            accessibilityRole="button"
                            accessibilityState={{ selected: selectedMemberId === member.id }}
                            onPress={() => setSelectedMemberId(member.id)}
                            style={[
                              styles.memberOption,
                              selectedMemberId === member.id && styles.selectedMemberOption,
                            ]}
                          >
                            <Text>{member.name}</Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    ) : (
                      <Text style={styles.placeholderText}>Add members first</Text>
                    )}
                  </View>
                  <View>
                    
                    <Button title="Add" onPress={addItem} />
                  </View>
                  
                  {/* <Button title="Cancel" onPress={() => setPopupVisible(false)} /> */}
                </View>
              </View>
            </Modal>
          </View>
          <View style={styles.Totals}>
            <Text>Total: {computeItemTotal()}</Text>
            {members.map((member) => {
              const balance = computeMemberExpenses(member);

              return (
                <View key={member.id}>
                  <Text>
                    {member.name} {balance < 0
                      ? `is owed ${Math.abs(balance).toFixed(2)}`
                      : balance > 0
                        ? `owes ${balance.toFixed(2)}`
                        : "Settled"}
                  </Text>
                </View>
              );
              
            })} 
            <Text>{members.map((member) => `${member.name} spent ${member.spent}`).join(", ")}</Text>
          </View>
        </View>
        <View style={styles.BottomSection}>
          {/* <Button title="Add Item" onPress={addItem} /> */}
          <Button title="Add" onPress={() => setPopupVisible(true)} />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#888",
    padding: 10,
    // marginVertical: 5,
  },
  backdrop: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  popup: {
    width: "85%",
    padding: 24,
    borderRadius: 12,
    backgroundColor: "white",
    gap: 16,
  },
  membersPopup: {
    height: "75%",
    maxHeight: "85%",
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  priceInput: {
    flex: 1,
  },
  memberOptions: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 8,
  },
  memberOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
  },
  selectedMemberOption: {
    backgroundColor: "#b3d38e",
    borderColor: "#63833f",
  },
  itemPayer: {
    color: "#666",
    fontSize: 12,
  },
  memberList: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  memberRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemList: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  placeholderText: {
    color: "#888",
  },
  HeaderSection: {
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  middleSection: {
    flex: 1,
  },
  BottomSection: {
    paddingVertical: 10,
  },
  Totals: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: "#b3d38e",
  },

  phantomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    // borderStyle: "dashed",
  },
  phantomInput: {
    width: "50%",
    // borderWidth: 1,
    // borderStyle: "dashed",
    // borderColor: "#aaa",
     paddingHorizontal: 10,
    paddingVertical: 10,
    color: "#999",
  },
  phantomSpentInput: {
    textAlign: "right",
  },
  titleHeader: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
