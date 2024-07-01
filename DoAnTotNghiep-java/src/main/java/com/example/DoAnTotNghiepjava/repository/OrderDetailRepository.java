package com.example.DoAnTotNghiepjava.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.DoAnTotNghiepjava.entity.OrderDetail;


@Repository
public interface OrderDetailRepository extends CrudRepository<OrderDetail, Long> {

    @Query("SELECT fp FROM OrderDetail fp WHERE fp.orderId = :orderId")
    List<OrderDetail> findByOrderId(int orderId);
    Optional<OrderDetail> findById(int id);
    List<OrderDetail> findByStatus(int orderStatus);
}

