package com.crafteconomy.blockchain.transactions.function_testing;

import java.io.Serializable;
import java.util.UUID;
import java.util.function.Consumer;

import org.bukkit.Bukkit;
import org.bukkit.entity.Player;


public class Examples implements Serializable {
    
    @SuppressWarnings("deprecation")
    public static Consumer<UUID> purchaseBusinessLicense() {
        Consumer<UUID> purchase = (uuid) -> {       

            String name = getNameIfOnline(uuid);
            
            Bukkit.broadcastMessage("[COMPLETE] Business License for: " + name + " == " + uuid.toString() + "\n");                
        };
        return purchase;
    }

    @SuppressWarnings("deprecation")
    public static Consumer<UUID> TEST_youPaidXCraft() {
        Consumer<UUID> testing_craft = (amount) -> {                           
            Bukkit.broadcastMessage("[COMPLETE] You paid" + amount + " ucraft for this");                
        };
        return testing_craft;
    }

    @SuppressWarnings("deprecation")
    public static Consumer<UUID> purchaseSomeItem(String item) {
        Consumer<UUID> purchase = (uuid) -> {       
            
            String name = getNameIfOnline(uuid);
            
            Bukkit.broadcastMessage("[COMPLETE] Purchased "+item+" for: " + name + " == " + uuid.toString() + "\n");                
        };
        return purchase;
    }


    @SuppressWarnings("deprecation")
    public static Consumer<UUID> revertSomeActionOnExpire() {
        Consumer<UUID> purchase = (uuid) -> {                   
            String name = getNameIfOnline(uuid);            
            Bukkit.broadcastMessage("[EXPIRED] Tx expired in redis, so this code ran as ex: " + name + " (" + uuid.toString() + ")\n");                
        };
        return purchase;
    }



    private static String getNameIfOnline(UUID uuid) {
        String playername = "";
        // check if the UUID is online
        Player player = Bukkit.getPlayer(uuid);
        if(player != null) {
            playername = player.getName();
        }
        return playername;
    }

}
