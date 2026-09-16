package com.mediflow.dsa.trie;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class TrieNode {
    private final Map<Character, TrieNode> children = new HashMap<>();
    private boolean isEndOfWord = false;
    private final List<MedicineSearchResult> medicines = new ArrayList<>();

    public Map<Character, TrieNode> getChildren() {
        return children;
    }

    public boolean isEndOfWord() {
        return isEndOfWord;
    }

    public void setEndOfWord(boolean endOfWord) {
        isEndOfWord = endOfWord;
    }

    public List<MedicineSearchResult> getMedicines() {
        return medicines;
    }

    public static class MedicineSearchResult {
        private final Long id;
        private final String name;
        private final String dosageForm;
        private final String unitPrice;

        public MedicineSearchResult(Long id, String name, String dosageForm, String unitPrice) {
            this.id = id;
            this.name = name;
            this.dosageForm = dosageForm;
            this.unitPrice = unitPrice;
        }

        public Long getId() { return id; }
        public String getName() { return name; }
        public String getDosageForm() { return dosageForm; }
        public String getUnitPrice() { return unitPrice; }
    }
}
