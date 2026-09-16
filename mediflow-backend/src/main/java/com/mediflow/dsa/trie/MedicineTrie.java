package com.mediflow.dsa.trie;

import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class MedicineTrie {

    private final TrieNode root = new TrieNode();

    public synchronized void insert(Long id, String name, String dosageForm, String unitPrice) {
        if (name == null || name.trim().isEmpty()) return;

        TrieNode current = root;
        String lowerName = name.toLowerCase().trim();

        for (char ch : lowerName.toCharArray()) {
            current = current.getChildren().computeIfAbsent(ch, c -> new TrieNode());
        }
        current.setEndOfWord(true);
        current.getMedicines().add(new TrieNode.MedicineSearchResult(id, name, dosageForm, unitPrice));
    }

    public synchronized List<TrieNode.MedicineSearchResult> searchPrefix(String prefix, int maxResults) {
        List<TrieNode.MedicineSearchResult> results = new ArrayList<>();
        if (prefix == null || prefix.trim().isEmpty()) return results;

        TrieNode current = root;
        String lowerPrefix = prefix.toLowerCase().trim();

        for (char ch : lowerPrefix.toCharArray()) {
            current = current.getChildren().get(ch);
            if (current == null) {
                return results; // No prefix match found
            }
        }

        // Collect matching words under this subtree using DFS
        collectWords(current, results, maxResults);
        return results;
    }

    private void collectWords(TrieNode node, List<TrieNode.MedicineSearchResult> results, int maxResults) {
        if (node == null || results.size() >= maxResults) return;

        if (node.isEndOfWord()) {
            for (TrieNode.MedicineSearchResult res : node.getMedicines()) {
                if (results.size() < maxResults) {
                    results.add(res);
                } else {
                    break;
                }
            }
        }

        for (TrieNode child : node.getChildren().values()) {
            collectWords(child, results, maxResults);
            if (results.size() >= maxResults) break;
        }
    }

    public synchronized void clear() {
        root.getChildren().clear();
    }
}
